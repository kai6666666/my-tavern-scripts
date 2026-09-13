// @ts-nocheck
/**
 * apply-json-cell-fallback-for-crud.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createApplyJsonCellFallbackForCrud(deps: any) {
  const applyJsonCellFallbackForCrud = async (input: CrudExistingRowPatchInput, colIndex: number): Promise<boolean> => {
    const liveData = deps.readRuntimeTableDataReference(input.api);
    const liveEntry =
      deps.findDiffSnapshotEntry(liveData, input.sheetKey || input.tableName, input.sheet) ||
      deps.findDiffSnapshotEntry(liveData, input.crudTableName, input.sheet);
    const sheetKey = liveEntry?.key || input.sheetKey || '';
    if (!sheetKey) return false;

    const value = deps.getCrudCellValueForWrite(
      input.headers,
      input.nextRow,
      colIndex,
      input.sheet,
      input.columnAliasMap || deps.buildCrudColumnAliasMap(input.sheet),
    );
    deps.patchCrudSheetCellInRecord(liveData, sheetKey, input.sheet, input.rowIndex, colIndex, value);
    deps.assertCrudRequiredCellValues(
      input.tableName,
      input.headers,
      input.nextRow,
      input.sheet,
      input.rowIndex,
      input.columnAliasMap || deps.buildCrudColumnAliasMap(input.sheet),
    );
    const persisted = await deps.patchLatestChatSheetCellWithoutTracking(
      sheetKey,
      input.sheet,
      input.rowIndex,
      colIndex,
      value,
    );
    if (!persisted) return false;

    input.api._notifyTableUpdate?.();
    console.warn('[DICE]ACU updateCell failed; saved cell via JSON-floor fallback without importTableAsJson:', {
      tableName: input.tableName,
      sheetKey,
      rowIndex: input.rowIndex + 1,
      column: String(input.headers[colIndex] || `#${colIndex + 1}`),
      messageIndex: persisted.messageIndex,
      patchedKeys: persisted.patchedKeys,
    });
    return true;
  };
  return applyJsonCellFallbackForCrud;
}
