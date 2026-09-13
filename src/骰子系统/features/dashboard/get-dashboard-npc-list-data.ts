// @ts-nocheck
/**
 * get-dashboard-npc-list-data.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetDashboardNpcListData(deps: any) {
  const getDashboardNpcListData = (allTables: Record<string, RelationGraphTableInput>) => {
    const npcTableResults = deps.DashboardDataParser.findTables(allTables, 'npc');
    const graphSources = deps.getActiveDashboardRelationshipGraphSources();
    const graphEntries =
      graphSources.length > 0 ? deps.collectDashboardNpcEntriesFromRelationshipSources(allTables, graphSources) : [];
    const entries =
      graphEntries.length > 0 ? graphEntries : deps.collectDashboardNpcEntriesFromTableResults(npcTableResults);
    const primaryEntry = entries[0];
    const primaryTable = npcTableResults[0];

    return {
      entries,
      tableName: primaryEntry?.tableName || primaryTable?.name || '重要角色表',
      tableKey: primaryEntry?.tableKey || primaryTable?.key || '',
      hasTable: entries.length > 0 || npcTableResults.length > 0,
    };
  };
  return getDashboardNpcListData;
}
