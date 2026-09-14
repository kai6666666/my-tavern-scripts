// @ts-nocheck
/**
 * build-row-data-for-crud.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createBuildRowDataForCrud(deps: any) {
  const buildRowDataForCrud = (
    headers,
    row,
    changedColumns?: Set<number>,
    sheet?: unknown,
    columnAliasMap = sheet ? deps.buildCrudColumnAliasMap(sheet) : {},
    enumConstraints = sheet ? deps.buildCrudEnumConstraintMap(sheet) : {},
  ) => {
    const data: RuntimeCrudRowData = {};
    headers.forEach((header, index) => {
      if (index === 0) return;
      if (!header) return;
      if (changedColumns && !changedColumns.has(index)) return;
      const headerName = String(header);
      data[headerName] = sheet
        ? deps.getCrudCellValueForWrite(headers, row, index, sheet, columnAliasMap, enumConstraints)
        : row?.[index] ?? '';
    });
    return data;
  };
  return buildRowDataForCrud;
}
