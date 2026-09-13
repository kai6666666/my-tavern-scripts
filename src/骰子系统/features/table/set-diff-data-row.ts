// @ts-nocheck
/**
 * set-diff-data-row.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createSetDiffDataRow(deps: any) {
  const setDiffDataRow = (sheet: DiffSheet | null | undefined, rowIndex: number, row: DiffRow): boolean => {
    if (!Array.isArray(sheet?.content)) return false;
    sheet.content[rowIndex + 1] = [...row];
    return true;
  };
  return setDiffDataRow;
}
