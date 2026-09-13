// @ts-nocheck
/**
 * get-stored-panel-height.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetStoredPanelHeight(deps: any) {
  const getStoredPanelHeight = (panelKey: unknown): number | null => {
    const key = String(panelKey ?? '').trim();
    if (!key) return null;
    return deps.normalizePanelHeightValue(deps.getTableHeights()[key]);
  };
  return getStoredPanelHeight;
}
