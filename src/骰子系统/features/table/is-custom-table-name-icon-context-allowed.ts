// @ts-nocheck
/**
 * is-custom-table-name-icon-context-allowed.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createIsCustomTableNameIconContextAllowed(deps: any) {
  const isCustomTableNameIconContextAllowed = (context: CustomTableNameIconContext): boolean => {
    if (deps.CUSTOM_TABLE_NAME_ICON_DENIED_MODULES.has(context.moduleId)) return false;
    if (deps.CUSTOM_TABLE_NAME_ICON_DENIED_SECTIONS.has(context.section)) return false;
    if (deps.isCustomTableNameIconTableDenied(context.tableName)) return false;

    if (context.moduleId === 'table-name') {
      return context.section === 'table';
    }
    if (context.moduleId === 'global-interaction-map-marker') {
      return context.section === 'map';
    }
    if (context.moduleId === 'item') {
      return context.section === 'item';
    }
    if (context.moduleId === 'equipment') {
      return context.section === 'equipment';
    }
    if (context.moduleId === 'faction') {
      return context.section === 'faction';
    }
    if (context.moduleId === 'global-interaction-panel') {
      return deps.CUSTOM_TABLE_NAME_ICON_ALLOWED_PANEL_SECTIONS.has(context.section);
    }
    if (context.moduleId === 'shop') {
      return context.section === 'shop';
    }

    return false;
  };
  return isCustomTableNameIconContextAllowed;
}
