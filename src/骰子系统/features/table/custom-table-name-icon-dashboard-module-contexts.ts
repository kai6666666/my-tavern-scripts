// @ts-nocheck
/**
 * custom-table-name-icon-dashboard-module-contexts.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createCustomTableNameIconDashboardModuleContexts(deps: any) {
  const CUSTOM_TABLE_NAME_ICON_DASHBOARD_MODULE_CONTEXTS: Record<string, DashboardCustomTableNameIconContextInfo> = {
    location: { moduleId: 'global-interaction-map-marker', section: 'map' },
    bag: { moduleId: 'item', section: 'item' },
    equip: { moduleId: 'equipment', section: 'equipment' },
    quest: { moduleId: 'global-interaction-panel', section: 'task' },
    skill: { moduleId: 'global-interaction-panel', section: 'skill' },
  };
  return CUSTOM_TABLE_NAME_ICON_DASHBOARD_MODULE_CONTEXTS;
}
