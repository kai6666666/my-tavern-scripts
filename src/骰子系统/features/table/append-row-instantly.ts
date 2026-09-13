// @ts-nocheck
/**
 * append-row-instantly.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createAppendRowInstantly(deps: any) {
  const appendRowInstantly = async (tableKey: string, newRowData: unknown[]): Promise<void> => {
    await deps.runInSaveQueue(async () => {
      const api = deps.assertRuntimeCrudApi();
      const source = deps.resolveRuntimeMutationSource(tableKey);
      const sourceData = source?.data;
      const entry = source?.entry;
      if (!entry?.sheet?.name || !Array.isArray(entry.sheet.content)) {
        throw new Error(`表格 "${tableKey}" 不存在`);
      }

      const headers = deps.getSheetHeaders(entry.sheet);
      const tableName = entry.sheet.name;
      const crudTableName = deps.getCrudTableIdentifier(entry.sheet, tableName);
      const nextRow = [...newRowData];
      const columnAliasMap = deps.buildCrudColumnAliasMap(entry.sheet);
      deps.assertCrudRequiredColumnsRepresented(tableName, headers, entry.sheet);
      deps.assertCrudInsertRequiredCells(tableName, headers, nextRow, entry.sheet, deps.getSheetRows(entry.sheet).length);
      deps.assertCrudEnumConstraints(
        tableName,
        headers,
        nextRow,
        entry.sheet,
        deps.getSheetRows(entry.sheet).length,
        undefined,
        columnAliasMap,
      );
      deps.assertCrudLengthConstraints(
        tableName,
        headers,
        nextRow,
        entry.sheet,
        deps.getSheetRows(entry.sheet).length,
        undefined,
        columnAliasMap,
      );
      const rowData = deps.buildRowDataForCrud(headers, nextRow, undefined, entry.sheet, columnAliasMap);
      const result = await api.insertRow({ tableName: crudTableName, data: rowData, skipNotify: true });
      if (result === false || result === -1) {
        throw new Error(`向 "${tableName}" 追加新行失败：数据库拒绝写入，请检查表结构、必填列和枚举约束。`);
      }

      const fallbackData = deps.cloneRuntimeDataValue(sourceData);
      const fallbackEntry =
        deps.findRuntimeSheetEntryForMutation(fallbackData, entry.key) ||
        deps.findRuntimeSheetEntryForMutation(fallbackData, tableKey);
      if (fallbackEntry?.sheet?.content) fallbackEntry.sheet.content.push([...nextRow]);
      deps.updateRuntimeDataCacheAfterCrud(api, fallbackData, entry.key || tableKey);
    });
  };
  return appendRowInstantly;
}
