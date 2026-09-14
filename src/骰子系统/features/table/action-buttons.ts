// @ts-nocheck
/**
 * action-buttons.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createActionButtons(deps: any) {
  const ACTION_BUTTONS = [
    // { id: 'acu-btn-save-global', icon: 'fa-save', title: '保存所有修改' }, // 已废弃：使用即时保存
    { id: 'acu-btn-open-editor', icon: 'fa-database', title: '打开数据库' },
    { id: 'acu-btn-open-visualizer', icon: 'fa-table-columns', title: '打开可视化表格编辑' },
    { id: 'acu-btn-collapse', icon: 'fa-chevron-down', title: '收起面板' },
    { id: 'acu-btn-refill', icon: 'fa-bolt', title: '重新填表' },
    { id: 'acu-btn-settings', icon: 'fa-cog', title: '全能设置' },
  ];
  return ACTION_BUTTONS;
}
