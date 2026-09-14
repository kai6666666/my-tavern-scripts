// @ts-nocheck
/**
 * custom-table-name-icon-sections.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createCustomTableNameIconSections(deps: any) {
  const CUSTOM_TABLE_NAME_ICON_SECTIONS: readonly CustomTableNameIconSection[] = [
    'table',
    'map',
    'item',
    'equipment',
    'faction',
    'shop',
    'task',
    'skill',
    'generic',
    'character',
    'relationship',
    'alias',
    'user',
  ];
  return CUSTOM_TABLE_NAME_ICON_SECTIONS;
}
