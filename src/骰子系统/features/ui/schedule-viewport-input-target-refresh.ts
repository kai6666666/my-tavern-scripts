// @ts-nocheck
/**
 * schedule-viewport-input-target-refresh.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createScheduleViewportInputTargetRefresh(deps: any) {
  const scheduleViewportInputTargetRefresh = () => {
    if (deps.getViewportInputTargetsRaf() !== null) return;

    deps.setViewportInputTargetsRaf(requestAnimationFrame(() => {
      deps.setViewportInputTargetsRaf(null);
      const targetWindow = deps.getTavernHostWindow();
      const targetDocument = deps.getTavernHostDocument();
      deps.refreshViewportInputTargetListeners(targetWindow, targetDocument);
      deps.scheduleViewportBoundsRefresh();
    }));
  };
  return scheduleViewportInputTargetRefresh;
}
