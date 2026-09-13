// @ts-nocheck
/**
 * clear-floating-collapse-bounds-listeners.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createClearFloatingCollapseBoundsListeners(deps: any) {
  const clearFloatingCollapseBoundsListeners = () => {
    if (deps.getFloatingCollapseBoundsListenerWindow() && deps.getFloatingCollapseBoundsRefreshHandler()) {
      deps.getFloatingCollapseBoundsListenerWindow().removeEventListener('resize', deps.getFloatingCollapseBoundsRefreshHandler());
      deps.getFloatingCollapseBoundsListenerWindow().removeEventListener(
        'orientationchange',
        deps.getFloatingCollapseBoundsRefreshHandler(),
      );
      deps.getFloatingCollapseBoundsListenerWindow().visualViewport?.removeEventListener(
        'resize',
        deps.getFloatingCollapseBoundsRefreshHandler(),
      );
      deps.getFloatingCollapseBoundsListenerWindow().visualViewport?.removeEventListener(
        'scroll',
        deps.getFloatingCollapseBoundsRefreshHandler(),
      );
    }

    if (deps.getFloatingCollapseBoundsRaf() !== null) {
      cancelAnimationFrame(deps.getFloatingCollapseBoundsRaf());
      deps.setFloatingCollapseBoundsRaf(null);
    }

    deps.setFloatingCollapseBoundsListenerWindow(null);
    deps.setFloatingCollapseBoundsRefreshHandler(null);
  };
  return clearFloatingCollapseBoundsListeners;
}
