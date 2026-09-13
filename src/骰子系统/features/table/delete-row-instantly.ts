// @ts-nocheck
/**
 * delete-row-instantly.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createDeleteRowInstantly(deps: any) {
  const deleteRowInstantly = async (tableKey: string, rowIndex: number): Promise<void> => {
    await deps.runInSaveQueue(async () => {
      const api = deps.assertRuntimeCrudApi();
      const source = deps.resolveRuntimeMutationSource(tableKey);
      const sourceData = source?.data;
      const entry = source?.entry;
      if (!entry?.sheet?.name || !Array.isArray(entry.sheet.content)) {
        throw new Error(`表格 "${tableKey}" 不存在`);
      }

      const tableName = entry.sheet.name;
      const crudTableName = deps.getCrudTableIdentifier(entry.sheet, tableName);
      const result = await api.deleteRow({ tableName: crudTableName, rowIndex: rowIndex + 1, skipNotify: true });
      if (result === false || result === -1) throw new Error(`删除 "${tableName}" 第 ${rowIndex + 1} 行失败`);

      const fallbackData = deps.cloneRuntimeDataValue(sourceData);
      const fallbackEntry =
        deps.findRuntimeSheetEntryForMutation(fallbackData, entry.key) ||
        deps.findRuntimeSheetEntryForMutation(fallbackData, tableKey);
      if (fallbackEntry?.sheet?.content?.[rowIndex + 1]) fallbackEntry.sheet.content.splice(rowIndex + 1, 1);
      deps.updateRuntimeDataCacheAfterCrud(api, fallbackData, entry.key || tableKey);
    });
  };
  return deleteRowInstantly;
}
