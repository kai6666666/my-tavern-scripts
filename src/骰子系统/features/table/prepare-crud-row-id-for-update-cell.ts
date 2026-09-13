// @ts-nocheck
/**
 * prepare-crud-row-id-for-update-cell.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createPrepareCrudRowIdForUpdateCell(deps: any) {
  const prepareCrudRowIdForUpdateCell = (input: CrudExistingRowPatchInput, colIndex: number): CrudRowIdPreparation => {
    const liveData = deps.readRuntimeTableDataReference(input.api);
    const liveEntry =
      deps.findDiffSnapshotEntry(liveData, input.tableName, input.sheet) ||
      deps.findDiffSnapshotEntry(liveData, input.crudTableName, input.sheet);
    const liveRow = deps.getDiffDataRow(liveEntry?.sheet, input.rowIndex);
    const liveRowId = liveRow?.[0];
    const headerName = String(input.headers[colIndex] || '').trim();

    if (!deps.isCrudRowIdMissing(liveRowId)) return null;

    const inferred = deps.inferCrudRowIdForUpdateCell(input);
    console.log('[DICE]ACU updateCell row_id check:', {
      tableName: input.tableName,
      crudTableName: input.crudTableName,
      rowIndex: input.rowIndex + 1,
      column: headerName || `#${colIndex + 1}`,
      liveSheetKey: liveEntry?.key || '',
      liveRowId,
      currentRowId: input.currentRow?.[0],
      nextRowId: input.nextRow?.[0],
      inferredRowId: inferred?.rowId,
      inferredSource: inferred?.source || '',
      firstCellHeader: input.headers[0],
      primaryCell: liveRow?.[1] ?? input.nextRow?.[1] ?? input.currentRow?.[1],
    });

    if (!liveRow || !inferred || deps.isCrudRowIdMissing(inferred.rowId)) return null;

    const patchedRows: CrudRowIdPatch[] = [];
    const seenRows = new Set<DiffRow>();
    deps.patchCrudRowIdIfMissing(liveRow, inferred.rowId, patchedRows, seenRows);
    deps.patchCrudRowIdIfMissing(input.currentRow, inferred.rowId, patchedRows, seenRows);
    deps.patchCrudRowIdIfMissing(input.nextRow, inferred.rowId, patchedRows, seenRows);

    if (patchedRows.length > 0) {
      console.log('[DICE]ACU updateCell row_id repaired before API call:', {
        tableName: input.tableName,
        rowIndex: input.rowIndex + 1,
        rowId: inferred.rowId,
        source: inferred.source,
        patchedRowCount: patchedRows.length,
      });
      return {
        patchedRows,
        rowId: inferred.rowId,
        source: inferred.source,
      };
    }

    return null;
  };
  return prepareCrudRowIdForUpdateCell;
}
