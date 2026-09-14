// @ts-nocheck
/**
 * render-global-interaction-item-mark.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createRenderGlobalInteractionItemMark(deps: any) {
  const renderGlobalInteractionItemMark = (
    rowTitle: string,
    customContext?: CustomTableNameIconContext | null,
  ): string => {
    const displayName = deps.replaceUserPlaceholders(rowTitle).trim();
    return `<div class="acu-global-interaction-generic-mark" title="${deps.escapeHtml(displayName)}">${deps.renderCustomTableNameIconContent(deps.renderThemeIconContent(deps.getElementEmoji(displayName, null)), customContext)}</div>`;
  };
  return renderGlobalInteractionItemMark;
}
