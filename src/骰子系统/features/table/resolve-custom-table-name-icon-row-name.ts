// @ts-nocheck
/**
 * resolve-custom-table-name-icon-row-name.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createResolveCustomTableNameIconRowName(deps: any) {
  const resolveCustomTableNameIconRowName = (
    tableName: string,
    headers: unknown[],
    rowData: unknown[],
    rowIndex: number,
  ): string =>
    deps.resolveDashboardCustomTableNameIconRowName(tableName, headers, rowData) ||
    deps.resolveGlobalInteractionRowTitle(headers, rowData, rowIndex);
  return resolveCustomTableNameIconRowName;
}
