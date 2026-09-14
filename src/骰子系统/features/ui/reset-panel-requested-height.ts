// @ts-nocheck
/**
 * reset-panel-requested-height.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createResetPanelRequestedHeight(deps: any) {
  const resetPanelRequestedHeight = ($panel: JQuery<HTMLElement>, panelKey: unknown): void => {
    const key = String(panelKey ?? '').trim();
    if (key) {
      const heights = deps.getTableHeights();
      delete heights[key];
      deps.saveTableHeights(heights);
    }
    deps.clearPanelRequestedHeight($panel);
  };
  return resetPanelRequestedHeight;
}
