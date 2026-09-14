// @ts-nocheck
/**
 * patch-crud-sheet-cell-in-record.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createPatchCrudSheetCellInRecord(deps: any) {
  const patchCrudSheetCellInRecord = (
    record: unknown,
    sheetKey: string,
    desiredSheet: unknown,
    rowIndex: number,
    colIndex: number,
    value: unknown,
  ): string | null => {
    const entry = deps.findDiffSnapshotEntry(record, sheetKey, desiredSheet);
    const row = deps.getDiffDataRow(entry?.sheet, rowIndex);
    if (!entry || !row) return null;
    row[colIndex] = value;
    return entry.key;
  };
  return patchCrudSheetCellInRecord;
}
