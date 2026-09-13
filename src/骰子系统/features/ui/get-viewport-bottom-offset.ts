// @ts-nocheck
/**
 * get-viewport-bottom-offset.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetViewportBottomOffset(deps: any) {
  const getViewportBottomOffset = (): number => {
    const targetWindow = deps.getTavernHostWindow();
    const targetDocument = deps.getTavernHostDocument();
    const visualViewport = targetWindow.visualViewport;
    const viewportTop = visualViewport?.offsetTop || 0;
    const viewportHeight =
      visualViewport?.height || targetWindow.innerHeight || targetDocument.documentElement.clientHeight || 0;
    const viewportBottom = viewportTop + viewportHeight;
    const candidates = deps.getViewportBottomAnchorElements(targetDocument)
      .filter((el): el is HTMLElement => {
        const style = targetWindow.getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden') return false;
        const rect = el.getBoundingClientRect();
        const isComposerElement = deps.VIEWPORT_COMPOSER_ELEMENT_IDS.has(el.id) || el.tagName.toLowerCase() === 'textarea';
        const minTopRatio = isComposerElement ? 0.2 : 0.45;
        const maxHeight = isComposerElement
          ? Math.max(520, viewportHeight * 0.75)
          : Math.max(220, viewportHeight * 0.4);
        if (rect.width <= 0 || rect.height <= 0) return false;
        if (viewportHeight <= 0) return rect.bottom > 0;
        if (rect.top < viewportTop || rect.bottom > viewportBottom + 80) return false;
        if (rect.top < viewportTop + viewportHeight * minTopRatio) return false;
        if (rect.height > maxHeight) return false;
        return true;
      })
      .map(el => el.getBoundingClientRect());

    if (candidates.length === 0 || viewportHeight <= 0) return 12;

    const top = Math.min(...candidates.map(rect => rect.top));
    const offset = viewportBottom - top + 8;
    const maxOffset = Math.max(12, Math.round(viewportHeight * 0.65));
    return Math.min(maxOffset, Math.max(12, Math.round(offset)));
  };
  return getViewportBottomOffset;
}
