// @ts-nocheck
/**
 * setup-fixed-wrapper-bounds-listeners.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createSetupFixedWrapperBoundsListeners(deps: any) {
  const setupFixedWrapperBoundsListeners = () => {
    const config = deps.getConfig();
    if (config.positionMode !== 'fixed' || deps.isFloatingCollapseActive(config)) {
      deps.clearFixedWrapperBoundsListeners();
      return;
    }

    const targetWindow = deps.getTavernHostWindow();
    const targetDocument = deps.getTavernHostDocument();
    if (deps.getFixedWrapperBoundsListenerWindow() === targetWindow && deps.getFixedWrapperBoundsRefreshHandler()) {
      deps.refreshFixedAnchorResizeObserver(targetWindow, targetDocument);
      deps.setupFixedAnchorMutationObserver(targetWindow, targetDocument);
      return;
    }

    deps.clearFixedWrapperBoundsListeners();

    const refreshBounds = deps.scheduleFixedWrapperBoundsRefresh;
    targetWindow.addEventListener('resize', refreshBounds, { passive: true });
    targetWindow.addEventListener('orientationchange', refreshBounds, { passive: true });
    targetWindow.visualViewport?.addEventListener('resize', refreshBounds, { passive: true });
    targetWindow.visualViewport?.addEventListener('scroll', refreshBounds, { passive: true });
    deps.setFixedWrapperBoundsListenerWindow(targetWindow);
    deps.setFixedWrapperBoundsRefreshHandler(refreshBounds);
    deps.refreshFixedAnchorResizeObserver(targetWindow, targetDocument);
    deps.setupFixedAnchorMutationObserver(targetWindow, targetDocument);
  };
  return setupFixedWrapperBoundsListeners;
}
