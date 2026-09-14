// @ts-nocheck
/**
 * refresh-gacha-visualization.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createRefreshGachaVisualization(deps: any) {
  const refreshGachaVisualization = (rawDataOverride?: unknown) => {
    const rawData = rawDataOverride || deps.getCachedRawData();
    const overlay = deps.gachaShopRootElement?.isConnected
      ? deps.gachaShopRootElement
      : deps.getGachaShopProgressContainers()[0] || null;
    if (!overlay) return;
    if (!rawData) {
      deps.updateGachaShopProgressUi();
      return;
    }
    void (async () => {
      await deps.ensureGachaCatalogLoaded(rawData);
      if (!overlay.isConnected) return;
      overlay.innerHTML = deps.renderGachaPanelHtml(rawData);
      deps.hydrateCustomTableNameIconsIn(overlay);
    })();
  };
  return refreshGachaVisualization;
}
