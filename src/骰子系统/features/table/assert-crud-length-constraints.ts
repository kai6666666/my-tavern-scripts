// @ts-nocheck
/**
 * assert-crud-length-constraints.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createAssertCrudLengthConstraints(deps: any) {
  const assertCrudLengthConstraints = (
    tableName: string,
    headers,
    row,
    sheet,
    rowIndex: number,
    changedColumns?: Set<number>,
    columnAliasMap = deps.buildCrudColumnAliasMap(sheet),
  ): void => {
    if (!Array.isArray(row)) return;
    if (!Array.isArray(headers)) return;
    const constraints = deps.buildCrudLengthConstraintMap(sheet);
    if (Object.keys(constraints).length === 0) return;

    headers.forEach((header, index) => {
      if (index === 0) return;
      if (changedColumns && !changedColumns.has(index)) return;
      const headerName = String(header || '').trim();
      if (!headerName) return;

      const columnName = deps.getCrudColumnNameForHeader(columnAliasMap, headerName);
      const maxLength = constraints[columnName];
      if (maxLength === undefined) return;

      const value = String(row[index] ?? '');
      const length = deps.countUnicodeCharacters(value);
      if (length <= maxLength) return;

      throw new Error(
        `表 "${tableName}" 第 ${rowIndex + 1} 行的「${headerName}」长度为 ${length}，超过数据库结构允许的 ${maxLength} 字。请缩短内容，或调整表格结构的长度约束。`,
      );
    });
  };
  return assertCrudLengthConstraints;
}
