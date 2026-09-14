// @ts-nocheck
/**
 * custom-table-name-icon-manager-section-labels.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createCustomTableNameIconManagerSectionLabels(deps: any) {
  const CUSTOM_TABLE_NAME_ICON_MANAGER_SECTION_LABELS: Record<CustomTableNameIconSection, string> = {
    table: '表格',
    map: '地图',
    item: '物品',
    equipment: '装备',
    faction: '势力',
    shop: '商店',
    task: '任务',
    skill: '技能',
    generic: '通用',
    character: '角色',
    relationship: '关系',
    alias: '别名',
    user: '用户',
  };
  return CUSTOM_TABLE_NAME_ICON_MANAGER_SECTION_LABELS;
}
