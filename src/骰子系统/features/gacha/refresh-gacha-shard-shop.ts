// @ts-nocheck
/**
 * refresh-gacha-shard-shop.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createRefreshGachaShardShop(deps: any) {
  const refreshGachaShardShop = () => {
    const { $ } = deps.getCore();
    const $shopOverlay = $('.acu-gacha-shard-shop-overlay').first();
    if (!$shopOverlay.length) return;
    const rawData = deps.getCachedRawData() || deps.getTableData();
    void (async () => {
      await deps.ensureGachaCatalogLoaded(rawData);
      if (!$shopOverlay.length) return;
      const $nextOverlay = $(deps.renderGachaShardShopHtml(rawData));
      $shopOverlay.children().replaceWith($nextOverlay.children());
      deps.bindGachaShardShopInteractions($shopOverlay as JQuery<HTMLElement>);
      deps.hydrateCustomTableNameIconsIn($shopOverlay as JQuery<HTMLElement>);
    })();
  };
  return refreshGachaShardShop;
}
