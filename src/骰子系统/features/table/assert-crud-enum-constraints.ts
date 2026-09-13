// @ts-nocheck
/**
 * assert-crud-enum-constraints.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createAssertCrudEnumConstraints(deps: any) {
  const assertCrudEnumConstraints = (
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
    const constraints = deps.buildCrudEnumConstraintMap(sheet);
    if (Object.keys(constraints).length === 0) return;

    headers.forEach((header, index) => {
      if (index === 0) return;
      if (changedColumns && !changedColumns.has(index)) return;
      const headerName = String(header || '').trim();
      if (!headerName) return;

      const columnName = deps.getCrudColumnNameForHeader(columnAliasMap, headerName);
      const constraint = constraints[columnName];
      if (!constraint || constraint.values.length === 0) return;
      if (constraint.nullable && deps.isCrudNullableEnumEmptyValue(row[index])) return;

      const value = String(row[index] ?? '').trim();
      if (constraint.values.includes(value)) return;

      throw new Error(
        `表 "${tableName}" 第 ${rowIndex + 1} 行的「${headerName}」不能写入「${value || '空值'}」：数据库结构只允许 ${constraint.values.join('、')}。请调整表格结构/枚举，或把要写入的内容改为允许值。`,
      );
    });
  };
  return assertCrudEnumConstraints;
}
