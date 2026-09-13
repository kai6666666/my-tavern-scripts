// @ts-nocheck
/**
 * set-diff-data-cell.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createSetDiffDataCell(deps: any) {
  const setDiffDataCell = (
    sheet: DiffSheet | null | undefined,
    rowIndex: number,
    colIndex: number,
    value: unknown,
  ): boolean => {
    const row = deps.getDiffDataRow(sheet, rowIndex);
    if (!row) return false;
    row[colIndex] = value;
    return true;
  };
  return setDiffDataCell;
}
