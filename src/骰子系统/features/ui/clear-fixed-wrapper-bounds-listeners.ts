// @ts-nocheck
/**
 * clear-fixed-wrapper-bounds-listeners.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createClearFixedWrapperBoundsListeners(deps: any) {
  const clearFixedWrapperBoundsListeners = () => {
    if (deps.getFixedWrapperBoundsListenerWindow() && deps.getFixedWrapperBoundsRefreshHandler()) {
      deps.getFixedWrapperBoundsListenerWindow().removeEventListener('resize', deps.getFixedWrapperBoundsRefreshHandler());
      deps.getFixedWrapperBoundsListenerWindow().removeEventListener('orientationchange', deps.getFixedWrapperBoundsRefreshHandler());
      deps.getFixedWrapperBoundsListenerWindow().visualViewport?.removeEventListener('resize', deps.getFixedWrapperBoundsRefreshHandler());
      deps.getFixedWrapperBoundsListenerWindow().visualViewport?.removeEventListener('scroll', deps.getFixedWrapperBoundsRefreshHandler());
    }

    deps.clearFixedAnchorResizeObserver();
    deps.clearFixedAnchorMutationObserver();

    if (deps.getFixedWrapperBoundsRaf() !== null) {
      cancelAnimationFrame(deps.getFixedWrapperBoundsRaf());
      deps.setFixedWrapperBoundsRaf(null);
    }

    deps.setFixedWrapperBoundsListenerWindow(null);
    deps.setFixedWrapperBoundsRefreshHandler(null);
  };
  return clearFixedWrapperBoundsListeners;
}
