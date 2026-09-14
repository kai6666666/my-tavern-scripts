// @ts-nocheck
/**
 * custom-table-name-icon-denied-table-names.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createCustomTableNameIconDeniedTableNames(deps: any) {
  const CUSTOM_TABLE_NAME_ICON_DENIED_TABLE_NAMES = new Set<string>([
    '全局数据表',
    '纪要表',
    '总结表',
    '总结大纲表',
    '总体大纲',
    '选项表',
    '检定建议表',
    '主角信息',
    '重要人物表',
    '重要角色表',
  ]);
  return CUSTOM_TABLE_NAME_ICON_DENIED_TABLE_NAMES;
}
