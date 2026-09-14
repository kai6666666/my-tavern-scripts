// @ts-nocheck
/**
 * render-global-interaction-map-mark.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createRenderGlobalInteractionMapMark(deps: any) {
  const renderGlobalInteractionMapMark = (rowTitle: string, tableName: string, iconName?: string): string => {
    const iconContext = deps.createGlobalInteractionCustomTableNameIconContext(tableName, iconName || rowTitle);
    const locationEmoji = deps.getLocationEmoji(rowTitle);
    if (locationEmoji) {
      return `<div class="acu-global-interaction-map-mark" title="${deps.escapeHtml(rowTitle)}">${deps.renderCustomTableNameIconContent(deps.renderIcon(locationEmoji), iconContext)}</div>`;
    }
    return `<div class="acu-global-interaction-map-mark" title="${deps.escapeHtml(rowTitle)}">${deps.renderCustomTableNameIconContent(`<i class="fa-solid ${deps.escapeHtml(deps.getIconForTableName(tableName))}"></i>`, iconContext)}</div>`;
  };
  return renderGlobalInteractionMapMark;
}
