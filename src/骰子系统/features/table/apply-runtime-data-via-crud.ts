// @ts-nocheck
/**
 * apply-runtime-data-via-crud.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createApplyRuntimeDataViaCrud(deps: any) {
  const applyRuntimeDataViaCrud = async (
    tableData,
    modifiedSheetKeys?: string[],
    options?: { commitDeletes?: boolean },
  ) => {
    const api = deps.assertRuntimeCrudApi();
    const isPartialSave = Array.isArray(modifiedSheetKeys);
    const { dataToSave, sheetKeysToSave } = deps.sanitizeRuntimeTableData(
      tableData,
      modifiedSheetKeys,
      options?.commitDeletes === true,
    );
    if (sheetKeysToSave.length === 0) {
      console.info('[DICE]ACU CRUD 保存跳过：没有有效修改表');
      return dataToSave;
    }

    const latestData = deps.getTableData({ silent: true });
    if (!latestData) throw new Error('无法读取最新数据库基底，已取消保存以避免覆盖未保存表格');
    if (!isPartialSave) {
      const deletedSheetNames = Object.keys(latestData)
        .filter(key => key.startsWith('sheet_') && !dataToSave[key])
        .map(key => latestData[key]?.name || key);
      if (deletedSheetNames.length > 0) {
        throw new Error(`检测到整表删除：${deletedSheetNames.join('、')}。该结构级变更仅标注，不支持快捷保存。`);
      }
    }

    for (const sheetKey of sheetKeysToSave) {
      const desiredSheet = dataToSave[sheetKey];
      const latestEntry = deps.findRuntimeSheetEntryForCrud(latestData, sheetKey, desiredSheet);
      await deps.applySheetDataViaCrud(api, latestEntry?.key || sheetKey, desiredSheet, latestEntry?.sheet);
    }

    const refreshedData = deps.getTableData({ silent: true }) || dataToSave;
    deps.setCachedRawData(refreshedData);
    api._notifyTableUpdate?.();
    return refreshedData;
  };
  return applyRuntimeDataViaCrud;
}
