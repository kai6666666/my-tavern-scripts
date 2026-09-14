// @ts-nocheck
/**
 * create-dashboard-preset-modules-from-config.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createCreateDashboardPresetModulesFromConfig(deps: any) {
  const createDashboardPresetModulesFromConfig = (config: DashboardConfigMap): DashboardPresetModules => {
    const modules: DashboardPresetModules = {};
    deps.DASHBOARD_PRESET_MODULE_KEYS.forEach(moduleKey => {
      const moduleConfig = config[moduleKey];
      if (!moduleConfig) return;
      const columns: Record<string, DashboardPresetColumnConfig> = {};
      Object.entries(moduleConfig.columns).forEach(([columnKey, columnConfig]) => {
        columns[columnKey] = { keywords: [...columnConfig.keywords] };
      });
      modules[moduleKey] = {
        tableKeywords: [...moduleConfig.tableKeywords],
        columns,
      };
      const allowedFilters = deps.DASHBOARD_PRESET_FILTER_KEYS[moduleKey] || [];
      const filters: Record<string, DashboardPresetFilterConfig> = {};
      allowedFilters.forEach(filterKey => {
        const filterConfig = moduleConfig.filters?.[filterKey];
        if (!filterConfig) return;
        filters[filterKey] = {
          column: filterConfig.column,
          includes: [...filterConfig.includes],
          ...(filterConfig.excludeColumn ? { excludeColumn: filterConfig.excludeColumn } : {}),
          ...(filterConfig.excludes ? { excludes: [...filterConfig.excludes] } : {}),
        };
      });
      if (Object.keys(filters).length > 0) {
        modules[moduleKey].filters = filters;
      }
    });
    return modules;
  };
  return createDashboardPresetModulesFromConfig;
}
