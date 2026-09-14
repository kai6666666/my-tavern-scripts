// @ts-nocheck
/**
 * get-active-dashboard-relationship-graph-sources.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetActiveDashboardRelationshipGraphSources(deps: any) {
  const getActiveDashboardRelationshipGraphSources = (): DashboardRelationshipGraphSourceConfig[] => {
    const graphConfig = deps.getDashboardPresetManager().getActivePreset().modules[deps.getDASHBOARD_RELATIONSHIP_GRAPH_MODULE_KEY()];
    return graphConfig?.sources || [];
  };
  return getActiveDashboardRelationshipGraphSources;
}
