// @ts-nocheck
/**
 * find-gacha-target-column-index.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createFindGachaTargetColumnIndex(deps: any) {
  const findGachaTargetColumnIndex = (headers: unknown[], headerName: string, sheet?: unknown): number => {
    const directIndex = headers.findIndex(header => deps.isGachaTargetTableAliasMatch(header, headerName));
    if (directIndex >= 0) return directIndex;

    const columnAliasMap = deps.buildCrudColumnAliasMap(sheet);
    if (Object.keys(columnAliasMap).length === 0) return -1;
    return headers.findIndex(header =>
      deps.isGachaTargetTableAliasMatch(deps.getCrudColumnNameForHeader(columnAliasMap, header), headerName),
    );
  };
  return findGachaTargetColumnIndex;
}
