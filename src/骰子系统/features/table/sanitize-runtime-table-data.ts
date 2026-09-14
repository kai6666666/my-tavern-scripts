// @ts-nocheck
/**
 * sanitize-runtime-table-data.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createSanitizeRuntimeTableData(deps: any) {
  const sanitizeRuntimeTableData = (tableData, modifiedSheetKeys?: string[], commitDeletes = false) => {
    const sourceData = tableData && typeof tableData === 'object' ? tableData : {};
    const dataToSave = {
      mate: sourceData.mate ? deps.cloneRuntimeDataValue(sourceData.mate) : { type: 'chatSheets', version: 1 },
    };

    Object.keys(sourceData).forEach(key => {
      if (key.startsWith('sheet_')) {
        dataToSave[key] = deps.cloneRuntimeDataValue(sourceData[key]);
      }
    });

    deps.syncInventoryMetadataForRawData(dataToSave);

    if (commitDeletes) {
      const deletions = deps.getPendingDeletions();
      Object.keys(deletions).forEach(key => {
        if (dataToSave[key]?.content) {
          deletions[key]
            .sort((left, right) => right - left)
            .forEach(index => {
              if (dataToSave[key].content[index + 1]) dataToSave[key].content.splice(index + 1, 1);
            });
        }
      });
    }

    const explicitKeys = deps.normalizeSheetKeys(modifiedSheetKeys);
    const sheetKeysToSave = explicitKeys || Object.keys(dataToSave).filter(key => key.startsWith('sheet_'));
    if (explicitKeys && explicitKeys.length === 0) {
      return { dataToSave, sheetKeysToSave: [] };
    }
    return { dataToSave, sheetKeysToSave };
  };
  return sanitizeRuntimeTableData;
}
