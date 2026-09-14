// @ts-nocheck
/**
 * get-inventory-global-context.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { DASHBOARD_TABLE_CONFIG } from '../dashboard/dashboard-table-config';
export function createGetInventoryGlobalContext(deps: any) {
  const getInventoryGlobalContext = rawData => {
    const tables = deps.processJsonData(rawData || {});
    const globalResult = deps.getDashboardDataParser().findTable(tables, 'global');
    const headers = globalResult?.data?.headers || [];
    const row = globalResult?.data?.rows?.[0] || [];
    const config = globalResult?.config || deps.getDashboardModuleConfig('global') || DASHBOARD_TABLE_CONFIG.global;
    const detailIdx = deps.getDashboardDataParser().findColumnIndex(headers, 'detailLocation', config);
    const timeIdx = deps.getDashboardDataParser().findColumnIndex(headers, 'currentTime', config);
    return {
      currentDetailLocation: detailIdx >= 0 ? String(row[detailIdx] || '').trim() : '',
      currentTime: timeIdx >= 0 ? String(row[timeIdx] || '').trim() : '',
    };
  };
  return getInventoryGlobalContext;
}
