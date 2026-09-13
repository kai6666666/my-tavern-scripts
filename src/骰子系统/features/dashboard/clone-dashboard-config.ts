// @ts-nocheck
/**
 * clone-dashboard-config.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createCloneDashboardConfig(deps: any) {
  const cloneDashboardConfig = (config: DashboardConfigMap): DashboardConfigMap => {
    const cloned: DashboardConfigMap = {};
    Object.entries(config).forEach(([moduleKey, moduleConfig]) => {
      const columns: Record<string, DashboardColumnConfig> = {};
      Object.entries(moduleConfig.columns).forEach(([columnKey, columnConfig]) => {
        columns[columnKey] = {
          ...columnConfig,
          keywords: [...columnConfig.keywords],
        };
      });
      cloned[moduleKey] = {
        tableKeywords: [...moduleConfig.tableKeywords],
        columns,
        ...(moduleConfig.filters
          ? { filters: JSON.parse(JSON.stringify(moduleConfig.filters)) as Record<string, DashboardFilterConfig> }
          : {}),
      };
    });
    return cloned;
  };
  return cloneDashboardConfig;
}
