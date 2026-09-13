// @ts-nocheck
/**
 * setup-floating-collapse-bounds-listeners.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createSetupFloatingCollapseBoundsListeners(deps: any) {
  const setupFloatingCollapseBoundsListeners = () => {
    if (!deps.isFloatingCollapseActive()) {
      deps.clearFloatingCollapseBoundsListeners();
      return;
    }

    const targetWindow = deps.getTavernHostWindow();
    if (deps.getFloatingCollapseBoundsListenerWindow() === targetWindow && deps.getFloatingCollapseBoundsRefreshHandler()) return;

    deps.clearFloatingCollapseBoundsListeners();

    const refreshBounds = deps.scheduleFloatingCollapseBoundsRefresh;
    targetWindow.addEventListener('resize', refreshBounds, { passive: true });
    targetWindow.addEventListener('orientationchange', refreshBounds, { passive: true });
    targetWindow.visualViewport?.addEventListener('resize', refreshBounds, { passive: true });
    targetWindow.visualViewport?.addEventListener('scroll', refreshBounds, { passive: true });
    deps.setFloatingCollapseBoundsListenerWindow(targetWindow);
    deps.setFloatingCollapseBoundsRefreshHandler(refreshBounds);
  };
  return setupFloatingCollapseBoundsListeners;
}
