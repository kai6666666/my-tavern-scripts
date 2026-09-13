// @ts-nocheck
/**
 * collect-dashboard-npc-entries-from-table-result.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createCollectDashboardNpcEntriesFromTableResult(deps: any) {
  const collectDashboardNpcEntriesFromTableResult = (entries, tableResult, source = null): number => {
    const table = tableResult?.table || tableResult?.data;
    if (!table) return 0;

    const tableName = String(tableResult.tableName || tableResult.name || '');
    const tableKey = String(table.key || tableResult.key || '');
    const headers = (table.headers || []).map(header => String(header || ''));
    const rows = table.rows || [];
    const nameIdx = deps.findDashboardNpcNameColumnIndex(headers, source);

    if (nameIdx < 0) {
      console.warn(deps.withTableTemplateCheckHint(`[DICE]仪表盘角色区: 表格"${tableName || '未知'}"缺少名称列`));
      return 0;
    }

    if (source?.relationColumn && deps.findRelationGraphRelationColumnMatch(headers, source.relationColumn).index < 0) {
      console.warn(deps.withTableTemplateCheckHint(`[DICE]仪表盘角色区: 表格"${tableName || '未知'}"缺少关系列`));
      return 0;
    }

    const npcConfig = deps.getDashboardModuleConfig('npc') || deps.DASHBOARD_TABLE_CONFIG.npc;
    const statusIdx = deps.DashboardDataParser.findColumnIndex(headers, 'status', npcConfig);
    const positionIdx = deps.DashboardDataParser.findColumnIndex(headers, 'position', npcConfig);
    let inSceneIdx = deps.DashboardDataParser.findColumnIndex(headers, 'inScene', npcConfig);
    if (inSceneIdx < 0 || inSceneIdx >= headers.length) {
      inSceneIdx = headers.findIndex(header => header.includes('在场') || header.includes('离场'));
    }

    const beforeCount = entries.length;
    rows.forEach((row, rowIndex) => {
      const rawName = String(row?.[nameIdx] || '').trim();
      if (!rawName) return;
      deps.pushDashboardNpcEntry(entries, {
        name: rawName,
        status: statusIdx >= 0 && statusIdx < row.length ? row[statusIdx] || '' : '',
        position: positionIdx >= 0 && positionIdx < row.length ? row[positionIdx] || '' : '',
        isInScene:
          inSceneIdx >= 0 && inSceneIdx < row.length
            ? deps.isDashboardRoleInSceneValue(row[inSceneIdx], headers[inSceneIdx])
            : false,
        index: rowIndex,
        tableKey,
        tableName,
      });
    });

    return entries.length - beforeCount;
  };
  return collectDashboardNpcEntriesFromTableResult;
}
