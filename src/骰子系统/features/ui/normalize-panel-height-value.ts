// @ts-nocheck
/**
 * normalize-panel-height-value.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createNormalizePanelHeightValue(deps: any) {
  const normalizePanelHeightValue = (value: unknown): number | null => {
    const height = Number.parseInt(String(value ?? ''), 10);
    if (!Number.isFinite(height) || height <= 0) return null;
    return Math.max(deps.getMIN_PANEL_HEIGHT(), Math.min(deps.getMAX_PANEL_HEIGHT(), height));
  };
  return normalizePanelHeightValue;
}
