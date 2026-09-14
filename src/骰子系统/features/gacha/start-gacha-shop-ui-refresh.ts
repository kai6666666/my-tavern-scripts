// @ts-nocheck
/**
 * start-gacha-shop-ui-refresh.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createStartGachaShopUiRefresh(deps: any) {
  const startGachaShopUiRefresh = () => {
    if (deps.getGachaShopUiRefreshTimer()) return;
    deps.setGachaShopUiRefreshTimer(setInterval(() => {
      if (!deps.getGachaShopProgressContainers().length) {
        if (deps.getGachaShopUiRefreshTimer()) {
          clearInterval(deps.getGachaShopUiRefreshTimer());
          deps.setGachaShopUiRefreshTimer(null);
        }
        return;
      }
      deps.updateGachaShopProgressUi();
    }, deps.getGACHA_SHOP_UI_REFRESH_MS()));
  };
  return startGachaShopUiRefresh;
}
