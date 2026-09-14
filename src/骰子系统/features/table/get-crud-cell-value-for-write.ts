// @ts-nocheck
/**
 * get-crud-cell-value-for-write.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetCrudCellValueForWrite(deps: any) {
  const getCrudCellValueForWrite = (
    headers,
    row,
    index: number,
    sheet: unknown,
    columnAliasMap = deps.buildCrudColumnAliasMap(sheet),
    enumConstraints = deps.buildCrudEnumConstraintMap(sheet),
  ): unknown => {
    const value = Array.isArray(row) ? row[index] : undefined;
    const headerName = deps.normalizeDiffText(Array.isArray(headers) ? headers[index] : '');
    const columnName = deps.getCrudColumnNameForHeader(columnAliasMap, headerName);
    const constraint = columnName ? enumConstraints[columnName] : undefined;
    if (constraint?.nullable && deps.isCrudNullableEnumEmptyValue(value)) return null;
    return value ?? '';
  };
  return getCrudCellValueForWrite;
}
