// @ts-nocheck
/**
 * clone-dashboard-preset-modules.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createCloneDashboardPresetModules(deps: any) {
  const cloneDashboardPresetModules = (modules: DashboardPresetModules): DashboardPresetModules => {
    const cloned: DashboardPresetModules = {};
    Object.entries(modules).forEach(([moduleKey, moduleConfig]) => {
      const columns: Record<string, DashboardPresetColumnConfig> = {};
      Object.entries(moduleConfig.columns || {}).forEach(([columnKey, columnConfig]) => {
        columns[columnKey] = { keywords: [...columnConfig.keywords] };
      });
      const filters: Record<string, DashboardPresetFilterConfig> = {};
      Object.entries(moduleConfig.filters || {}).forEach(([filterKey, filterConfig]) => {
        filters[filterKey] = {
          ...(filterConfig.column ? { column: filterConfig.column } : {}),
          ...(filterConfig.includes ? { includes: [...filterConfig.includes] } : {}),
          ...(filterConfig.excludeColumn ? { excludeColumn: filterConfig.excludeColumn } : {}),
          ...(filterConfig.excludes ? { excludes: [...filterConfig.excludes] } : {}),
        };
      });
      const sources = (moduleConfig.sources || []).map(source => ({
        mode: source.mode,
        tableKeywords: [...source.tableKeywords],
        nameColumn: [...source.nameColumn],
        relationColumn: [...source.relationColumn],
        ...(source.target ? { target: source.target } : {}),
      }));
      cloned[moduleKey] = {
        ...(moduleConfig.tableKeywords ? { tableKeywords: [...moduleConfig.tableKeywords] } : {}),
        ...(Object.keys(columns).length > 0 ? { columns } : {}),
        ...(Object.keys(filters).length > 0 ? { filters } : {}),
        ...(sources.length > 0 ? { sources } : {}),
      };
    });
    return cloned;
  };
  return cloneDashboardPresetModules;
}
