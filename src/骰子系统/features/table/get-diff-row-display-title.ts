// @ts-nocheck
/**
 * get-diff-row-display-title.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetDiffRowDisplayTitle(deps: any) {
  const getDiffRowDisplayTitle = (headers: DiffRow, row: DiffRow, rowIndex: number): string => {
    const preferred = deps.getDiffPreferredColumns(headers).filter(index => index > 0);
    for (const colIndex of preferred) {
      const value = deps.normalizeDiffText(row[colIndex]);
      if (value) return value;
    }
    return deps.normalizeDiffText(row[0]) || `行 ${rowIndex + 1}`;
  };
  return getDiffRowDisplayTitle;
}
