// @ts-nocheck
/**
 * save-sheets-via-json-floor-without-tracking.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createSaveSheetsViaJsonFloorWithoutTracking(deps: any) {
  const saveSheetsViaJsonFloorWithoutTracking = async (tableData, modifiedSheetKeys?: string[]) => {
    const api = deps.assertRuntimeCrudApi();
    const { dataToSave, sheetKeysToSave } = deps.sanitizeRuntimeTableData(tableData, modifiedSheetKeys, false);
    if (sheetKeysToSave.length === 0) {
      console.info('[DICE]ACU JSON 楼层保存跳过：没有有效修改表');
      return dataToSave;
    }

    const liveData = deps.readRuntimeTableDataReference(api);
    for (const sheetKey of sheetKeysToSave) {
      const desiredSheet = dataToSave[sheetKey];
      if (!deps.isDiffSheet(desiredSheet)) continue;
      const persisted = await deps.patchLatestChatSheetWithoutTracking(sheetKey, desiredSheet);
      if (!persisted) {
        throw new Error(`保存 "${desiredSheet.name || sheetKey}" 的正则转换结果失败：找不到该表的历史数据楼层`);
      }
      deps.patchCrudSheetInRecord(liveData, sheetKey, desiredSheet);
      console.info('[DICE]ACU 正则转换已按表回写 JSON 楼层（不写入更新追踪）:', {
        tableName: desiredSheet.name || sheetKey,
        sheetKey,
        messageIndex: persisted.messageIndex,
      });
    }

    if (typeof api.refreshDataAndWorldbook === 'function') {
      await api.refreshDataAndWorldbook();
    } else {
      api._notifyTableUpdate?.();
    }
    const refreshedData = deps.getTableData({ silent: true }) || dataToSave;
    deps.setCachedRawData(refreshedData);
    return refreshedData;
  };
  return saveSheetsViaJsonFloorWithoutTracking;
}
