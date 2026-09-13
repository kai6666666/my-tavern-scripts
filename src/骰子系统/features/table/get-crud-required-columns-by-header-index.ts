// @ts-nocheck
/**
 * get-crud-required-columns-by-header-index.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetCrudRequiredColumnsByHeaderIndex(deps: any) {
  const getCrudRequiredColumnsByHeaderIndex = (
    headers,
    sheet,
    columnAliasMap = deps.buildCrudColumnAliasMap(sheet),
  ): Map<number, string> => {
    const result = new Map<number, string>();
    if (!Array.isArray(headers)) return result;
    const requiredHeaders = deps.buildCrudRequiredHeaderSet(sheet);
    if (requiredHeaders.size === 0) return result;
    headers.forEach((header, index) => {
      if (index === 0) return;
      const headerName = deps.normalizeDiffText(header);
      if (!headerName) return;
      const columnName = deps.getCrudColumnNameForHeader(columnAliasMap, headerName);
      if (requiredHeaders.has(headerName) || requiredHeaders.has(columnName)) {
        result.set(index, headerName);
      }
    });
    return result;
  };
  return getCrudRequiredColumnsByHeaderIndex;
}
