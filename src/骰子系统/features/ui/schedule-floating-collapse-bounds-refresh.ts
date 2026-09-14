// @ts-nocheck
/**
 * schedule-floating-collapse-bounds-refresh.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createScheduleFloatingCollapseBoundsRefresh(deps: any) {
  const scheduleFloatingCollapseBoundsRefresh = () => {
    if (!deps.isFloatingCollapseActive()) return;
    if (deps.getFloatingCollapseBoundsRaf() !== null) return;

    deps.setFloatingCollapseBoundsRaf(requestAnimationFrame(() => {
      deps.setFloatingCollapseBoundsRaf(null);
      deps.updateFloatingCollapseBounds();
    }));
  };
  return scheduleFloatingCollapseBoundsRefresh;
}
