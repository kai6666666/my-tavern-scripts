// @ts-nocheck
/**
 * normalize-dashboard-preset-filters.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createNormalizeDashboardPresetFilters(deps: any) {
  const normalizeDashboardPresetFilters = (
    moduleKey: string,
    rawFilters: unknown,
  ): Record<string, DashboardPresetFilterConfig> => {
    if (!deps.isRecordValue(rawFilters)) {
      throw new Error(`模块 ${moduleKey}.filters 必须是对象`);
    }

    const moduleConfig = deps.DASHBOARD_TABLE_CONFIG[moduleKey];
    const allowedFilterKeys = deps.DASHBOARD_PRESET_FILTER_KEYS[moduleKey] || [];
    const filters: Record<string, DashboardPresetFilterConfig> = {};

    Object.entries(rawFilters).forEach(([filterKey, rawFilter]) => {
      if (!allowedFilterKeys.includes(filterKey)) {
        throw new Error(`模块 ${moduleKey} 不支持过滤器: ${filterKey}`);
      }
      if (!moduleConfig.filters?.[filterKey]) {
        throw new Error(`模块 ${moduleKey} 不存在默认过滤器: ${filterKey}`);
      }
      if (!deps.isRecordValue(rawFilter)) {
        throw new Error(`模块 ${moduleKey}.filters.${filterKey} 必须是对象`);
      }

      const filterConfig: DashboardPresetFilterConfig = {};
      if ('column' in rawFilter) {
        const column = typeof rawFilter.column === 'string' ? rawFilter.column.trim() : '';
        if (!column || !moduleConfig.columns[column]) {
          throw new Error(`模块 ${moduleKey}.filters.${filterKey}.column 必须引用已有字段`);
        }
        filterConfig.column = column;
      }
      if ('excludeColumn' in rawFilter) {
        const excludeColumn = typeof rawFilter.excludeColumn === 'string' ? rawFilter.excludeColumn.trim() : '';
        if (!excludeColumn || !moduleConfig.columns[excludeColumn]) {
          throw new Error(`模块 ${moduleKey}.filters.${filterKey}.excludeColumn 必须引用已有字段`);
        }
        filterConfig.excludeColumn = excludeColumn;
      }
      if ('includes' in rawFilter) {
        filterConfig.includes = deps.normalizeDashboardOptionalStringArray(
          rawFilter.includes,
          `模块 ${moduleKey}.filters.${filterKey}.includes`,
        );
      }
      if ('excludes' in rawFilter) {
        filterConfig.excludes = deps.normalizeDashboardOptionalStringArray(
          rawFilter.excludes,
          `模块 ${moduleKey}.filters.${filterKey}.excludes`,
        );
      }

      if (Object.keys(filterConfig).length === 0) {
        throw new Error(`模块 ${moduleKey}.filters.${filterKey} 至少需要配置一个字段`);
      }
      filters[filterKey] = filterConfig;
    });

    return filters;
  };
  return normalizeDashboardPresetFilters;
}
