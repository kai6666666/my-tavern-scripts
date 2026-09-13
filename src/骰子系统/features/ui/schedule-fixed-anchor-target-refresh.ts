// @ts-nocheck
/**
 * schedule-fixed-anchor-target-refresh.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createScheduleFixedAnchorTargetRefresh(deps: any) {
  const scheduleFixedAnchorTargetRefresh = () => {
    if (deps.getFixedAnchorTargetsRaf() !== null) return;

    deps.setFixedAnchorTargetsRaf(requestAnimationFrame(() => {
      deps.setFixedAnchorTargetsRaf(null);
      const targetWindow = deps.getTavernHostWindow();
      const targetDocument = deps.getTavernHostDocument();
      deps.refreshFixedAnchorResizeObserver(targetWindow, targetDocument);
      deps.scheduleFixedWrapperBoundsRefresh();
    }));
  };
  return scheduleFixedAnchorTargetRefresh;
}
