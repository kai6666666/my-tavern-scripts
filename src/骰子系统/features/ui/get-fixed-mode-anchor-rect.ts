// @ts-nocheck
/**
 * get-fixed-mode-anchor-rect.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetFixedModeAnchorRect(deps: any) {
  const getFixedModeAnchorRect = (): DOMRect | null => {
    const targetWindow = deps.getTavernHostWindow();
    const targetDocument = deps.getTavernHostDocument();
    const visualViewport = targetWindow.visualViewport;
    const viewportTop = visualViewport?.offsetTop || 0;
    const viewportWidth =
      visualViewport?.width || targetWindow.innerWidth || targetDocument.documentElement.clientWidth || 0;
    const viewportHeight =
      visualViewport?.height || targetWindow.innerHeight || targetDocument.documentElement.clientHeight || 0;
    const viewportBottom = viewportTop + viewportHeight;
    const candidates = deps.getViewportBottomAnchorElements(targetDocument)
      .map(el => {
        const style = targetWindow.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return { el, style, rect };
      })
      .filter(({ style, rect }) => {
        if (style.display === 'none' || style.visibility === 'hidden') return false;
        if (rect.width <= 0 || rect.height <= 0) return false;
        if (viewportHeight > 0 && (rect.bottom < viewportTop || rect.top > viewportBottom + 80)) return false;
        return true;
      });

    if (candidates.length === 0) return deps.getViewportAnchorRect();

    const composerWidthCandidates =
      viewportWidth > 768 ? candidates.filter(({ rect }) => rect.width < viewportWidth * 0.92) : candidates;
    const pool = composerWidthCandidates.length > 0 ? composerWidthCandidates : candidates;
    pool.sort((a, b) => {
      const aPriority = deps.FIXED_MODE_ANCHOR_PRIORITY.get(a.el.id) ?? 99;
      const bPriority = deps.FIXED_MODE_ANCHOR_PRIORITY.get(b.el.id) ?? 99;
      if (aPriority !== bPriority) return aPriority - bPriority;
      return b.rect.width - a.rect.width;
    });
    return pool[0]?.rect ?? deps.getViewportAnchorRect();
  };
  return getFixedModeAnchorRect;
}
