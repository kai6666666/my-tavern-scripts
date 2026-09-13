// @ts-nocheck
/**
 * clear-viewport-bounds-listeners.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createClearViewportBoundsListeners(deps: any) {
  const clearViewportBoundsListeners = () => {
    if (deps.getViewportBoundsListenerWindow() && deps.getViewportBoundsRefreshHandler()) {
      deps.getViewportBoundsListenerWindow().removeEventListener('resize', deps.getViewportBoundsRefreshHandler());
      deps.getViewportBoundsListenerWindow().removeEventListener('orientationchange', deps.getViewportBoundsRefreshHandler());
      deps.getViewportBoundsListenerWindow().visualViewport?.removeEventListener('resize', deps.getViewportBoundsRefreshHandler());
      deps.getViewportBoundsListenerWindow().visualViewport?.removeEventListener('scroll', deps.getViewportBoundsRefreshHandler());
    }

    deps.clearViewportInputTargetListeners();
    deps.clearViewportInputMutationObserver();

    if (deps.getViewportBoundsRaf() !== null) {
      cancelAnimationFrame(deps.getViewportBoundsRaf());
      deps.setViewportBoundsRaf(null);
    }

    deps.setViewportBoundsListenerWindow(null);
    deps.setViewportBoundsRefreshHandler(null);
    deps.setViewportBoundsListenerAttached(false);
  };
  return clearViewportBoundsListeners;
}
