// @ts-nocheck
/**
 * get-equipment-column-map.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { DASHBOARD_TABLE_CONFIG } from '../../features/dashboard/dashboard-table-config';
export function createGetEquipmentColumnMap(deps: any) {
  const getEquipmentColumnMap = (equipmentResult, options: GachaRewardParseOptions = {}) => {
    const headers = equipmentResult?.data?.headers || [];
    const config = equipmentResult?.config || deps.getDashboardModuleConfig('equip') || DASHBOARD_TABLE_CONFIG.equip;
    const colMap: GachaRewardColumnMap = {
      name: deps.DashboardDataParser.findColumnIndex(headers, 'name', config),
      type: deps.DashboardDataParser.findColumnIndex(headers, 'type', config),
      part: deps.DashboardDataParser.findColumnIndex(headers, 'part', config),
      status: deps.DashboardDataParser.findColumnIndex(headers, 'isEquipped', config),
      quantity: deps.findGachaColumnByKeywords(headers, ['数量', '件数', '持有数']),
      quality: deps.findGachaColumnByKeywords(headers, ['品质', '稀有度', '品级']),
      tags: deps.findGachaColumnByKeywords(headers, ['标签', '标记', '词条']),
      effect: deps.findGachaColumnByKeywords(headers, ['效果', '作用', '能力', '特效']),
      description: deps.findGachaColumnByKeywords(headers, ['描述', '说明', '备注']),
    };
    return deps.applyGachaTargetColumnOverrides(
      colMap,
      headers,
      equipmentResult?.name || '装备表',
      options.targetColumns,
      equipmentResult?.data,
    );
  };
  return getEquipmentColumnMap;
}
