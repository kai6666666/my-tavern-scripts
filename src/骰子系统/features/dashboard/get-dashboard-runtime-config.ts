// @ts-nocheck
/**
 * get-dashboard-runtime-config.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetDashboardRuntimeConfig(deps: any) {
  const getDashboardRuntimeConfig = (): DashboardConfigMap => {
    if (deps.getDashboardRuntimeConfigCache()) return deps.getDashboardRuntimeConfigCache();

    const runtimeConfig = deps.cloneDashboardConfig(deps.DASHBOARD_TABLE_CONFIG);
    const activePreset = deps.DashboardPresetManager.getActivePreset();

    Object.entries(activePreset.modules || {}).forEach(([moduleKey, moduleOverride]) => {
      const moduleConfig = runtimeConfig[moduleKey];
      if (!moduleConfig) return;

      if (moduleOverride.tableKeywords && moduleOverride.tableKeywords.length > 0) {
        moduleConfig.tableKeywords = [...moduleOverride.tableKeywords];
      }

      Object.entries(moduleOverride.columns || {}).forEach(([columnKey, columnOverride]) => {
        const columnConfig = moduleConfig.columns[columnKey];
        if (columnConfig && columnOverride.keywords.length > 0) {
          columnConfig.keywords = [...columnOverride.keywords];
          return;
        }

        const allowedAdditionalColumns = deps.DASHBOARD_PRESET_ADDITIONAL_COLUMNS[moduleKey] || [];
        if (allowedAdditionalColumns.includes(columnKey) && columnOverride.keywords.length > 0) {
          moduleConfig.columns[columnKey] = {
            keywords: [...columnOverride.keywords],
            fallbackIndex: null,
          };
        }
      });

      Object.entries(moduleOverride.filters || {}).forEach(([filterKey, filterOverride]) => {
        const allowedFilterKeys = deps.DASHBOARD_PRESET_FILTER_KEYS[moduleKey] || [];
        const filterConfig = moduleConfig.filters?.[filterKey];
        if (!allowedFilterKeys.includes(filterKey) || !filterConfig) return;

        const mergedFilter: DashboardFilterConfig = { ...filterConfig, includes: [...filterConfig.includes] };
        if (filterConfig.excludes) {
          mergedFilter.excludes = [...filterConfig.excludes];
        }
        if (filterOverride.column && moduleConfig.columns[filterOverride.column]) {
          mergedFilter.column = filterOverride.column;
        }
        if (filterOverride.excludeColumn && moduleConfig.columns[filterOverride.excludeColumn]) {
          mergedFilter.excludeColumn = filterOverride.excludeColumn;
        }
        if (Array.isArray(filterOverride.includes)) {
          mergedFilter.includes = [...filterOverride.includes];
        }
        if (Array.isArray(filterOverride.excludes)) {
          mergedFilter.excludes = [...filterOverride.excludes];
        }
        moduleConfig.filters = {
          ...(moduleConfig.filters || {}),
          [filterKey]: mergedFilter,
        };
      });
    });

    deps.setDashboardRuntimeConfigCache(runtimeConfig);
    return runtimeConfig;
  };
  return getDashboardRuntimeConfig;
}
