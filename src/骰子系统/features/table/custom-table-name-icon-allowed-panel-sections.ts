// @ts-nocheck
/**
 * custom-table-name-icon-allowed-panel-sections.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createCustomTableNameIconAllowedPanelSections(deps: any) {
  const CUSTOM_TABLE_NAME_ICON_ALLOWED_PANEL_SECTIONS = new Set<CustomTableNameIconSection>([
    'map',
    'item',
    'equipment',
    'faction',
    'shop',
    'task',
    'skill',
    'generic',
  ]);
  return CUSTOM_TABLE_NAME_ICON_ALLOWED_PANEL_SECTIONS;
}
