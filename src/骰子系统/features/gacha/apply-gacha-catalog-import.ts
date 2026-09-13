// @ts-nocheck
/**
 * apply-gacha-catalog-import.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { GACHA_ITEM_DEFINITIONS } from '../../entities/gacha-items';
export function createApplyGachaCatalogImport(deps: any) {
  const applyGachaCatalogImport = async (
    rawData,
    analysis: GachaCatalogImportAnalysis,
    mode: GachaCatalogImportMode,
  ): Promise<GachaCatalogImportStats> => {
    await deps.ensureGachaCatalogLoaded(rawData);
    const customItems = [...deps.getCustomGachaItemDefinitions(rawData)];
    const originalCustomItems = deps.cloneGachaCatalogItems(customItems);
    const localStorageSnapshot = deps.collectGachaLocalStorageSnapshot([
      deps.STORAGE_KEY_GACHA_POOL_SETTINGS,
      deps.STORAGE_KEY_GACHA_ITEM_SETTINGS,
    ]);
    const customIndexById = new Map(customItems.map((item, index) => [item.id, index]));
    const builtInIds = new Set(GACHA_ITEM_DEFINITIONS.map(item => item.id));
    const existingIds = new Set(deps.getAllGachaItemDefinitions(rawData).map(item => item.id));
    const importedItemSettings: Array<{ id: string; enabled: boolean; order?: number }> = [];
    const stats: GachaCatalogImportStats = { added: 0, updated: 0, renamed: 0, skipped: analysis.skipped, warnings: [] };
    const importTimestamp = Date.now();

    analysis.items.forEach(item => {
      const isBuiltInConflict = builtInIds.has(item.id);
      const customIndex = customIndexById.get(item.id);
      const hasConflict = isBuiltInConflict || customIndex !== undefined;
      if (hasConflict && mode === 'skip') {
        stats.skipped += 1;
        return;
      }

      const nextItem: GachaItemDefinition = {
        id: item.id,
        name: item.name,
        type: item.type,
        quality: item.quality,
        ...(item.tags ? { tags: item.tags } : {}),
        ...(item.effect ? { effect: item.effect } : {}),
        description: item.description,
        poolTags: [...item.poolTags],
        icon: item.icon,
        enabled: deps.isGachaItemEnabled(item),
        order: item.order,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt || importTimestamp,
        weight: item.weight,
        stackable: item.stackable,
        unique: item.unique,
        grantQuantity: item.grantQuantity,
        rewardTarget: item.rewardTarget,
      };
      if (item.targetTable) nextItem.targetTable = item.targetTable;
      if (item.targetColumns) nextItem.targetColumns = item.targetColumns;
      if (item.customFields) nextItem.customFields = item.customFields;
      if (!deps.validateGachaCatalogImportItemTarget(rawData, nextItem, stats.warnings)) {
        stats.skipped += 1;
        return;
      }

      if (hasConflict && mode === 'rename') {
        nextItem.id = deps.createUniqueGachaItemId(item.id, existingIds);
        nextItem.createdAt = nextItem.createdAt || importTimestamp;
        customItems.push(nextItem);
        customIndexById.set(nextItem.id, customItems.length - 1);
        importedItemSettings.push({ id: nextItem.id, enabled: deps.isGachaItemEnabled(nextItem), order: nextItem.order });
        stats.renamed += 1;
        return;
      }

      if (customIndex !== undefined) {
        nextItem.createdAt = customItems[customIndex].createdAt || nextItem.createdAt || importTimestamp;
        customItems[customIndex] = nextItem;
        stats.updated += 1;
      } else {
        nextItem.createdAt = nextItem.createdAt || importTimestamp;
        customItems.push(nextItem);
        customIndexById.set(nextItem.id, customItems.length - 1);
        existingIds.add(nextItem.id);
        hasConflict ? (stats.updated += 1) : (stats.added += 1);
      }
      importedItemSettings.push({ id: nextItem.id, enabled: deps.isGachaItemEnabled(nextItem), order: nextItem.order });
    });

    const savedCatalog = await deps.saveStoredGachaCatalog(customItems);
    if (!savedCatalog) throw new Error('自定义物品保存失败');
    try {
      if (stats.added + stats.updated + stats.renamed > 0) deps.mergeImportedGachaPools(analysis.pools);
      if (importedItemSettings.length > 0) {
        const record = deps.getStoredGachaItemSettings();
        const nextSettings = { ...record.items };
        importedItemSettings.forEach(entry => {
          const existing = nextSettings[entry.id] || { enabled: true, order: 999 };
          nextSettings[entry.id] = {
            enabled: entry.enabled,
            order: entry.order !== undefined ? deps.normalizeGachaItemOrder(entry.order) : existing.order,
          };
        });
        deps.saveGachaItemSettingsRecord(nextSettings);
      }
      deps.ensureGachaPoolsForTags(customItems.flatMap(item => [...item.poolTags]));
    } catch (error) {
      const rolledBackCatalog = await deps.saveStoredGachaCatalog(originalCustomItems);
      const rollbackWarnings = deps.restoreGachaLocalStorageSnapshot(localStorageSnapshot);
      const message = deps.getRuntimeErrorMessage(error) || '写入卡池或物品设置失败';
      const rollbackMessage = [
        !rolledBackCatalog ? '自定义物品目录回滚失败' : '',
        ...rollbackWarnings,
      ].filter(Boolean).join('；');
      if (rollbackMessage) throw new Error(`${message}；${rollbackMessage}`);
      throw error;
    }
    return stats;
  };
  return applyGachaCatalogImport;
}
