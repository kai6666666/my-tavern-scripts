// @ts-nocheck
/**
 * ensure-panel-navigation-visible.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createEnsurePanelNavigationVisible(deps: any) {
  function ensurePanelNavigationVisible(_$root?: JQuery<HTMLElement>): void {
    const config = deps.getConfig();
    if (deps.isFloatingCollapseActive(config)) return;

    if (config.positionMode === 'viewport') {
      deps.scheduleViewportBoundsRefresh();
      return;
    }
    if (config.positionMode === 'fixed') {
      // fixed 模式的根在聊天底部；后台重绘不能主动滚动宿主阅读位置。
      deps.scheduleFixedWrapperBoundsRefresh();
      return;
    }
  }
  return ensurePanelNavigationVisible;
}
