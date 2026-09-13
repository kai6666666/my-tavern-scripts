// @ts-nocheck
/**
 * normalize-dashboard-relationship-graph-config.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createNormalizeDashboardRelationshipGraphConfig(deps: any) {
  const normalizeDashboardRelationshipGraphConfig = (
    rawModule: Record<string, unknown>,
  ): DashboardPresetModuleConfig => {
    if (!Array.isArray(rawModule.sources)) {
      throw new Error('模块 relationshipGraph.sources 必须是数组');
    }

    const sources = rawModule.sources.map((rawSource, index) => {
      if (!deps.isRecordValue(rawSource)) {
        throw new Error(`模块 relationshipGraph.sources.${index} 必须是对象`);
      }

      const mode = typeof rawSource.mode === 'string' ? rawSource.mode.trim() : '';
      if (!deps.DASHBOARD_RELATIONSHIP_GRAPH_SOURCE_MODES.includes(mode as DashboardRelationshipGraphSourceMode)) {
        throw new Error(`模块 relationshipGraph.sources.${index}.mode 只能是 fixedTarget 或 relationList`);
      }

      const source: DashboardRelationshipGraphSourceConfig = {
        mode: mode as DashboardRelationshipGraphSourceMode,
        tableKeywords: deps.normalizeDashboardKeywordArray(
          rawSource.tableKeywords,
          `模块 relationshipGraph.sources.${index}.tableKeywords`,
        ),
        nameColumn: deps.normalizeDashboardKeywordArray(
          rawSource.nameColumn,
          `模块 relationshipGraph.sources.${index}.nameColumn`,
        ),
        relationColumn: deps.normalizeDashboardKeywordArray(
          rawSource.relationColumn,
          `模块 relationshipGraph.sources.${index}.relationColumn`,
        ),
      };

      if ('target' in rawSource) {
        const target = typeof rawSource.target === 'string' ? rawSource.target.trim() : '';
        if (!target) {
          throw new Error(`模块 relationshipGraph.sources.${index}.target 必须是非空字符串`);
        }
        source.target = target;
      }

      return source;
    });

    if (sources.length === 0) {
      throw new Error('模块 relationshipGraph.sources 至少需要一个来源');
    }

    return { sources };
  };
  return normalizeDashboardRelationshipGraphConfig;
}
