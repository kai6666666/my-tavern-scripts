// @ts-nocheck
/**
 * get-inventory-column-map.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { DASHBOARD_TABLE_CONFIG } from '../../features/dashboard/dashboard-table-config';
export function createGetInventoryColumnMap(deps: any) {
  const getInventoryColumnMap = (inventoryResult, options: GachaRewardParseOptions = {}) => {
    const headers = inventoryResult?.data?.headers || [];
    const config = inventoryResult?.config || deps.getDashboardModuleConfig('bag') || DASHBOARD_TABLE_CONFIG.bag;
    const colMap: GachaRewardColumnMap = {
      name: deps.DashboardDataParser.findColumnIndex(headers, 'name', config),
      type: deps.DashboardDataParser.findColumnIndex(headers, 'type', config),
      quantity: deps.DashboardDataParser.findColumnIndex(headers, 'count', config),
      quality: deps.findGachaColumnByKeywords(headers, ['品质', '稀有度', '品级']),
      tags: deps.findGachaColumnByKeywords(headers, ['标签', '标记', '词条']),
      effect: deps.findGachaColumnByKeywords(headers, ['效果', '作用', '能力', '特效']),
      description: deps.findGachaColumnByKeywords(headers, ['描述', '说明', '用途', '备注']),
    };
    return deps.applyGachaTargetColumnOverrides(
      colMap,
      headers,
      inventoryResult?.name || '物品表',
      options.targetColumns,
      inventoryResult?.data,
    );
  };
  return getInventoryColumnMap;
}
