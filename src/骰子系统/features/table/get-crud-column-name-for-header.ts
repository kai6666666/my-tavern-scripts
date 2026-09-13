// @ts-nocheck
/**
 * get-crud-column-name-for-header.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetCrudColumnNameForHeader(deps: any) {
  const getCrudColumnNameForHeader = (columnAliasMap: Record<string, string>, headerName: unknown): string => {
    const trimmedHeader = deps.normalizeDiffText(headerName);
    return (
      columnAliasMap[trimmedHeader] ||
      columnAliasMap[deps.normalizeCrudHeaderLookupKey(trimmedHeader)] ||
      trimmedHeader
    );
  };
  return getCrudColumnNameForHeader;
}
