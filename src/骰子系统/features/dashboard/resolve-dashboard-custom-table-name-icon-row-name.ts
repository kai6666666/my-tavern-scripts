// @ts-nocheck
/**
 * resolve-dashboard-custom-table-name-icon-row-name.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createResolveDashboardCustomTableNameIconRowName(deps: any) {
  const resolveDashboardCustomTableNameIconRowName = (
    tableName: string,
    headers: unknown[],
    rowData: unknown[],
  ): string | null => {
    for (const moduleKey of deps.getDashboardModuleKeysForTableName(tableName)) {
      const moduleConfig = deps.getDashboardModuleConfig(moduleKey);
      if (!moduleConfig?.columns?.name) continue;
      const nameColumnIndex = deps.getDashboardDataParser().findColumnIndex(headers, 'name', moduleConfig);
      const nameText = nameColumnIndex >= 0 ? deps.getStringLikeCellText(rowData[nameColumnIndex]) : '';
      if (nameText) return nameText;
    }
    return null;
  };
  return resolveDashboardCustomTableNameIconRowName;
}
