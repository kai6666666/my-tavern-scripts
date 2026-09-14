// @ts-nocheck
/**
 * save-panel-requested-height.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createSavePanelRequestedHeight(deps: any) {
  const savePanelRequestedHeight = (panelKey: unknown, height: unknown): number | null => {
    const key = String(panelKey ?? '').trim();
    const normalizedHeight = deps.normalizePanelHeightValue(height);
    if (!key || !normalizedHeight) return null;
    const heights = deps.getTableHeights();
    heights[key] = normalizedHeight;
    deps.saveTableHeights(heights);
    return normalizedHeight;
  };
  return savePanelRequestedHeight;
}
