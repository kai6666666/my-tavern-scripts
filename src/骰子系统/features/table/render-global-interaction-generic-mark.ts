// @ts-nocheck
/**
 * render-global-interaction-generic-mark.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createRenderGlobalInteractionGenericMark(deps: any) {
  const renderGlobalInteractionGenericMark = (
    rowTitle: string,
    customContext?: CustomTableNameIconContext | null,
  ): string => {
    const displayName = deps.replaceUserPlaceholders(rowTitle).trim();
    const fallbackText = displayName.charAt(0) || '?';
    return `<div class="acu-global-interaction-generic-mark" aria-hidden="true">${deps.renderCustomTableNameIconContent(`<span>${deps.escapeHtml(fallbackText)}</span>`, customContext)}</div>`;
  };
  return renderGlobalInteractionGenericMark;
}
