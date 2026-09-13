// @ts-nocheck
/**
 * collect-dashboard-npc-entries-from-table-results.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createCollectDashboardNpcEntriesFromTableResults(deps: any) {
  const collectDashboardNpcEntriesFromTableResults = tableResults => {
    const entries = [];
    tableResults.forEach(tableResult => deps.collectDashboardNpcEntriesFromTableResult(entries, tableResult));
    return entries;
  };
  return collectDashboardNpcEntriesFromTableResults;
}
