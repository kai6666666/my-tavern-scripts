// @ts-nocheck
/**
 * analyze-custom-table-name-icon-pack-import.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createAnalyzeCustomTableNameIconPackImport(deps: any) {
  const analyzeCustomTableNameIconPackImport = (value: unknown): CustomTableNameIconPackImportAnalysis => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      throw new Error('图标包格式无效');
    }
    const raw = value as Record<string, unknown>;
    if (raw.schemaVersion !== deps.CUSTOM_TABLE_NAME_ICON_PACK_SCHEMA_VERSION) {
      throw new Error(`仅支持 schemaVersion ${deps.CUSTOM_TABLE_NAME_ICON_PACK_SCHEMA_VERSION} 的图标包`);
    }
    if (!Array.isArray(raw.entries)) {
      throw new Error('图标包缺少 entries 数组');
    }

    const now = Date.now();
    const existingEntries = deps.CustomTableNameIconStoreManager.getAll().reduce<Record<string, CustomTableNameIconEntry>>(
      (result, entry) => {
        result[deps.getCustomTableNameIconContextKey(entry)] = entry;
        return result;
      },
      {},
    );
    const analysis: CustomTableNameIconPackImportAnalysis = {
      entriesToImport: [],
      importedCount: 0,
      overwrittenCount: 0,
      skippedInvalidUrlCount: 0,
      skippedNonWhitelistCount: 0,
      skippedInvalidEntryCount: 0,
      localMissingCount: 0,
    };

    raw.entries.forEach(item => {
      const packEntry = deps.normalizeCustomTableNameIconPackEntry(item);
      if (!packEntry) {
        analysis.skippedInvalidEntryCount += 1;
        return;
      }
      if (!deps.isCustomTableNameIconContextAllowed(packEntry)) {
        analysis.skippedNonWhitelistCount += 1;
        return;
      }

      const contextKey = deps.getCustomTableNameIconContextKey(packEntry);
      const previousEntry = existingEntries[contextKey] || null;
      const createdAt = previousEntry?.createdAt || now;
      const updatedAt = now;
      if (packEntry.sourceType === 'url') {
        const imageUrl = String(packEntry.url || '').trim();
        if (deps.getCustomTableNameIconImageUrlValidationError(imageUrl)) {
          analysis.skippedInvalidUrlCount += 1;
          return;
        }
        analysis.entriesToImport.push({
          moduleId: packEntry.moduleId,
          tableName: packEntry.tableName,
          section: packEntry.section,
          name: packEntry.name,
          sourceType: 'url',
          imageUrl,
          localIconKey: null,
          imageMimeType: packEntry.metadata.imageMimeType,
          imageSize: packEntry.metadata.imageSize,
          createdAt,
          updatedAt,
        });
      } else {
        const localIconKey = String(packEntry.localKey || deps.getCustomTableNameIconManagerLocalKey(packEntry)).trim();
        if (!localIconKey) {
          analysis.skippedInvalidEntryCount += 1;
          return;
        }
        analysis.entriesToImport.push({
          moduleId: packEntry.moduleId,
          tableName: packEntry.tableName,
          section: packEntry.section,
          name: packEntry.name,
          sourceType: 'local',
          imageUrl: '',
          localIconKey,
          imageMimeType: packEntry.metadata.imageMimeType,
          imageSize: packEntry.metadata.imageSize,
          createdAt,
          updatedAt,
        });
        analysis.localMissingCount += 1;
      }
      if (previousEntry) {
        analysis.overwrittenCount += 1;
      }
    });

    analysis.importedCount = analysis.entriesToImport.length;
    return analysis;
  };
  return analyzeCustomTableNameIconPackImport;
}
