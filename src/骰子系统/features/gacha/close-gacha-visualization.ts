// @ts-nocheck
/**
 * close-gacha-visualization.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createCloseGachaVisualization(deps: any) {
  const closeGachaVisualization = () => {
    if (deps.getGachaShopRootElement()?.isConnected) {
      deps.getGachaShopRootElement().remove();
    }
    deps.setGachaShopRootElement(null);
    $('.acu-gacha-overlay, .acu-gacha-shard-shop-overlay, .acu-gacha-pickup-detail-overlay').remove();
    if (deps.getGachaShopUiRefreshTimer()) {
      clearInterval(deps.getGachaShopUiRefreshTimer());
      deps.setGachaShopUiRefreshTimer(null);
    }
  };
  return closeGachaVisualization;
}
