// @ts-nocheck
/**
 * dashboard-relationship-graph-source-modes.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createDashboardRelationshipGraphSourceModes(deps: any) {
  const DASHBOARD_RELATIONSHIP_GRAPH_SOURCE_MODES: DashboardRelationshipGraphSourceMode[] = [
    'fixedTarget',
    'relationList',
  ];
  return DASHBOARD_RELATIONSHIP_GRAPH_SOURCE_MODES;
}
