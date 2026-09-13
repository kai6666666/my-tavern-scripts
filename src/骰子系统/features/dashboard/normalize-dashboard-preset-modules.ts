// @ts-nocheck
/**
 * normalize-dashboard-preset-modules.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createNormalizeDashboardPresetModules(deps: any) {
  const normalizeDashboardPresetModules = (rawModules: unknown): DashboardPresetModules => {
    if (!deps.isRecordValue(rawModules)) {
      throw new Error('modules 必须是对象');
    }

    const modules: DashboardPresetModules = {};
    Object.entries(rawModules).forEach(([moduleKey, rawModule]) => {
      if (moduleKey === deps.DASHBOARD_RELATIONSHIP_GRAPH_MODULE_KEY) {
        if (!deps.isRecordValue(rawModule)) {
          throw new Error('模块 relationshipGraph 必须是对象');
        }
        modules[moduleKey] = deps.normalizeDashboardRelationshipGraphConfig(rawModule);
        return;
      }

      if (!deps.DASHBOARD_PRESET_MODULE_KEYS.includes(moduleKey as (typeof deps.DASHBOARD_PRESET_MODULE_KEYS)[number])) {
        throw new Error(`未知仪表盘区域: ${moduleKey}`);
      }
      if (!deps.isRecordValue(rawModule)) {
        throw new Error(`模块 ${moduleKey} 必须是对象`);
      }

      const moduleConfig: DashboardPresetModuleConfig = {};
      if ('tableKeywords' in rawModule) {
        moduleConfig.tableKeywords = deps.normalizeDashboardKeywordArray(
          rawModule.tableKeywords,
          `模块 ${moduleKey}.tableKeywords`,
        );
      }

      if ('columns' in rawModule) {
        if (!deps.isRecordValue(rawModule.columns)) {
          throw new Error(`模块 ${moduleKey}.columns 必须是对象`);
        }
        const columns: Record<string, DashboardPresetColumnConfig> = {};
        Object.entries(rawModule.columns).forEach(([columnKey, rawColumn]) => {
          const baseColumn = deps.DASHBOARD_TABLE_CONFIG[moduleKey]?.columns[columnKey];
          const allowedAdditionalColumns = deps.DASHBOARD_PRESET_ADDITIONAL_COLUMNS[moduleKey] || [];
          if (!baseColumn && !allowedAdditionalColumns.includes(columnKey)) {
            throw new Error(`模块 ${moduleKey} 不存在字段: ${columnKey}`);
          }

          const keywordsSource = Array.isArray(rawColumn)
            ? rawColumn
            : deps.isRecordValue(rawColumn)
              ? rawColumn.keywords
              : null;
          columns[columnKey] = {
            keywords: deps.normalizeDashboardKeywordArray(keywordsSource, `模块 ${moduleKey}.columns.${columnKey}.keywords`),
          };
        });
        if (Object.keys(columns).length > 0) {
          moduleConfig.columns = columns;
        }
      }

      if ('filters' in rawModule) {
        const filters = deps.normalizeDashboardPresetFilters(moduleKey, rawModule.filters);
        if (Object.keys(filters).length > 0) {
          moduleConfig.filters = filters;
        }
      }

      if (!moduleConfig.tableKeywords && !moduleConfig.columns && !moduleConfig.filters && !moduleConfig.sources) {
        throw new Error(`模块 ${moduleKey} 至少需要 tableKeywords、columns 或 filters`);
      }
      modules[moduleKey] = moduleConfig;
    });

    if (Object.keys(modules).length === 0) {
      throw new Error('modules 至少需要配置一个仪表盘区域');
    }

    return modules;
  };
  return normalizeDashboardPresetModules;
}
