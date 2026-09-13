// @ts-nocheck
/**
 * setup-viewport-bounds-listeners.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createSetupViewportBoundsListeners(deps: any) {
  const setupViewportBoundsListeners = () => {
    const config = deps.getConfig();
    if (config.positionMode !== 'viewport' || deps.isFloatingCollapseActive(config)) {
      deps.clearViewportBoundsListeners();
      return;
    }

    const targetWindow = deps.getTavernHostWindow();
    const targetDocument = deps.getTavernHostDocument();
    if (deps.getViewportBoundsListenerAttached() && deps.getViewportBoundsListenerWindow() === targetWindow) {
      deps.refreshViewportInputTargetListeners(targetWindow, targetDocument);
      deps.setupViewportInputMutationObserver(targetWindow, targetDocument);
      return;
    }

    deps.clearViewportBoundsListeners();

    const refreshBounds = deps.scheduleViewportBoundsRefresh;
    targetWindow.addEventListener('resize', refreshBounds, { passive: true });
    targetWindow.addEventListener('orientationchange', refreshBounds, { passive: true });
    targetWindow.visualViewport?.addEventListener('resize', refreshBounds, { passive: true });
    targetWindow.visualViewport?.addEventListener('scroll', refreshBounds, { passive: true });
    deps.setViewportBoundsListenerWindow(targetWindow);
    deps.setViewportBoundsRefreshHandler(refreshBounds);
    deps.setViewportBoundsListenerAttached(true);
    deps.refreshViewportInputTargetListeners(targetWindow, targetDocument);
    deps.setupViewportInputMutationObserver(targetWindow, targetDocument);
  };
  return setupViewportBoundsListeners;
}
