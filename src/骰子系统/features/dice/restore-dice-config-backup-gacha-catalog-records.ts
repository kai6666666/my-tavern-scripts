// @ts-nocheck
/**
 * restore-dice-config-backup-gacha-catalog-records.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { GACHA_CATALOG_VERSION } from '../../entities/gacha-items';
import { GachaCatalogDB } from '../../features/gacha/gacha-catalog-db';
export function createRestoreDiceConfigBackupGachaCatalogRecords(deps: any) {
  const restoreDiceConfigBackupGachaCatalogRecords = async (
    recordsValue: unknown,
    stats: DiceConfigBackupApplyStats,
    itemIdMap?: Map<string, string>,
    rawData = deps.getRuntimeGachaRawData(),
  ): Promise<void> => {
    if (recordsValue === undefined) return;
    if (!Array.isArray(recordsValue)) {
      stats.skipped += 1;
      stats.warnings.push('骰子商城配置与自定义物品: 自定义目录资源不是数组，已跳过。');
      return;
    }
    await deps.migrateGachaCatalogRecordsToGlobalScope();
    const incomingRecords: GachaCatalogRecord[] = [];
    for (const rawRecord of recordsValue) {
      const incomingRecord = deps.normalizeDiceConfigBackupGachaCatalogResourceRecord(
        rawRecord,
        stats.warnings,
        rawData,
      );
      if (!incomingRecord) {
        stats.skipped += 1;
        continue;
      }
      incomingRecords.push(incomingRecord);
    }
    const incomingGlobalRecord = deps.mergeGachaCatalogRecordsToGlobalScope(incomingRecords);
    if (!incomingGlobalRecord) return;

    const currentRecord = await GachaCatalogDB.get(deps.GACHA_CATALOG_GLOBAL_SCOPE_KEY);
    const currentCatalog = deps.normalizeGachaCatalogRecord(currentRecord) || deps.createEmptyGachaCatalog();
    const beforeTouched = stats.added + stats.overwritten + stats.skipped;
    const mergedItems = deps.mergeDiceConfigBackupGachaCatalogItems(
      currentCatalog.items,
      incomingGlobalRecord.items,
      stats,
      itemIdMap,
    );
    if (stats.added + stats.overwritten + stats.skipped === beforeTouched) {
      stats.skipped += 1;
    }
    const nextRecord: GachaCatalogRecord = {
      scopeKey: deps.GACHA_CATALOG_GLOBAL_SCOPE_KEY,
      version: Math.max(currentCatalog.version || 1, incomingGlobalRecord.version || 1, GACHA_CATALOG_VERSION),
      items: mergedItems,
      updatedAt: Date.now(),
    };
    const saved = await GachaCatalogDB.put(nextRecord);
    if (!saved) throw new Error('全局自定义物品目录保存失败');
    deps.setGachaCatalogCache({
      scopeKey: deps.GACHA_CATALOG_GLOBAL_SCOPE_KEY,
      catalog: {
        version: nextRecord.version,
        items: deps.cloneGachaCatalogItems(nextRecord.items),
        updatedAt: nextRecord.updatedAt,
      },
    });
    deps.ensureGachaPoolsForTags(incomingGlobalRecord.items.flatMap(item => [...item.poolTags]));
  };
  return restoreDiceConfigBackupGachaCatalogRecords;
}
