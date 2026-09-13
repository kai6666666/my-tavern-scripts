// @ts-nocheck
/**
 * collect-dashboard-npc-entries-from-relationship-sources.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createCollectDashboardNpcEntriesFromRelationshipSources(deps: any) {
  const collectDashboardNpcEntriesFromRelationshipSources = (
    allTables: Record<string, RelationGraphTableInput>,
    sources: DashboardRelationshipGraphSourceConfig[],
  ) => {
    const entries = [];
    const matchedTableKeys = new Set<string>();
    const usedSources: string[] = [];

    sources.forEach((source, sourceIndex) => {
      const sourceTableResults = deps.findRelationshipGraphSourceTables(allTables, source.tableKeywords);
      if (sourceTableResults.length === 0) {
        console.info(
          deps.withTableTemplateCheckHint(
            `[DICE]仪表盘角色区: 来源${sourceIndex + 1}未找到表格 (关键词: ${source.tableKeywords.join(', ')})`,
          ),
        );
        return;
      }

      sourceTableResults.forEach(tableResult => {
        const tableKey = String(tableResult.table.key || tableResult.tableName || '');
        if (tableKey && matchedTableKeys.has(tableKey)) return;

        const addedCount = deps.collectDashboardNpcEntriesFromTableResult(entries, tableResult, source);
        if (addedCount > 0) {
          if (tableKey) matchedTableKeys.add(tableKey);
          usedSources.push(tableResult.tableName);
        }
      });
    });

    if (entries.length > 0) {
      console.info(`[DICE]仪表盘角色区: 已合并来源 ${usedSources.join('、')}，共${entries.length}名角色`);
    }
    return entries;
  };
  return collectDashboardNpcEntriesFromRelationshipSources;
}
