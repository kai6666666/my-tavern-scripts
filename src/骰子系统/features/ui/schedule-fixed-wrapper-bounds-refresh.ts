// @ts-nocheck
/**
 * schedule-fixed-wrapper-bounds-refresh.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createScheduleFixedWrapperBoundsRefresh(deps: any) {
  const scheduleFixedWrapperBoundsRefresh = () => {
    const config = deps.getConfig();
    if (config.positionMode !== 'fixed') return;
    if (deps.getFixedWrapperBoundsRaf() !== null) return;

    deps.setFixedWrapperBoundsRaf(requestAnimationFrame(() => {
      deps.setFixedWrapperBoundsRaf(null);
      deps.updateFixedWrapperBounds();
    }));
  };
  return scheduleFixedWrapperBoundsRefresh;
}
