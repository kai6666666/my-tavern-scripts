// @ts-nocheck
/**
 * custom-table-name-icon-manager-module-labels.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createCustomTableNameIconManagerModuleLabels(deps: any) {
  const CUSTOM_TABLE_NAME_ICON_MANAGER_MODULE_LABELS: Record<CustomTableNameIconModuleId, string> = {
    'table-name': '通用表格',
    item: '物品',
    equipment: '装备',
    faction: '势力',
    'global-interaction-panel': '交互面板',
    'global-interaction-map-marker': '地图标记',
    shop: '商店',
    'avatar-manager': '角色头像预设',
    'relationship-graph': '关系图',
    'map-character-node': '地图角色',
    'character-interaction-panel': '角色交互',
    'alias-resolution': '别名解析',
    'user-graph-resolution': '用户解析',
  };
  return CUSTOM_TABLE_NAME_ICON_MANAGER_MODULE_LABELS;
}
