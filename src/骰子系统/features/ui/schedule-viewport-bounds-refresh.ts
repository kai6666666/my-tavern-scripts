// @ts-nocheck
/**
 * schedule-viewport-bounds-refresh.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createScheduleViewportBoundsRefresh(deps: any) {
  const scheduleViewportBoundsRefresh = () => {
    const config = deps.getConfig();
    if (config.positionMode !== 'viewport') return;
    if (deps.getViewportBoundsRaf() !== null) return;

    deps.setViewportBoundsRaf(requestAnimationFrame(() => {
      deps.setViewportBoundsRaf(null);
      deps.updateViewportWrapperBounds();
    }));
  };
  return scheduleViewportBoundsRefresh;
}
