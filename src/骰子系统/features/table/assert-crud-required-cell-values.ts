// @ts-nocheck
/**
 * assert-crud-required-cell-values.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createAssertCrudRequiredCellValues(deps: any) {
  const assertCrudRequiredCellValues = (
    tableName: string,
    headers,
    row,
    sheet,
    rowIndex: number,
    columnAliasMap = deps.buildCrudColumnAliasMap(sheet),
  ): void => {
    if (!Array.isArray(headers) || !Array.isArray(row)) return;
    const requiredColumns = deps.getCrudRequiredColumnsByHeaderIndex(headers, sheet, columnAliasMap);
    if (requiredColumns.size === 0) return;
    const missingColumns: string[] = [];
    requiredColumns.forEach((headerName, index) => {
      if (String(row[index] ?? '').trim() === '') missingColumns.push(headerName);
    });
    if (missingColumns.length > 0) {
      throw new Error(
        `表 "${tableName}" 第 ${rowIndex + 1} 行存在必填列为空：${missingColumns.join('、')}。请先补全这些字段，或调整数据库结构。`,
      );
    }
  };
  return assertCrudRequiredCellValues;
}
