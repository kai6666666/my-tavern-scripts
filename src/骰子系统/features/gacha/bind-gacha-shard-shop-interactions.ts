// @ts-nocheck
/**
 * bind-gacha-shard-shop-interactions.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createBindGachaShardShopInteractions(deps: any) {
  const bindGachaShardShopInteractions = ($overlay: JQuery<HTMLElement>) => {
    $overlay
      .off('click.acu_gacha_shard_buy_local')
      .on('click.acu_gacha_shard_buy_local', '.acu-gacha-shard-buy-btn', function (event) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        const itemId = String($(this).data('item-id') || '').trim();
        if (!itemId) return;
        deps.showGachaShardExchangeConfirm(itemId);
      });

    $overlay
      .off('click.acu_gacha_shard_detail_local')
      .on('click.acu_gacha_shard_detail_local', '.acu-gacha-shard-detail-btn', function (event) {
        event.preventDefault();
        event.stopPropagation();
        const itemId = String($(this).data('item-id') || '').trim();
        if (!itemId) return;
        deps.showGachaPickupItemDetail(itemId);
      });
  };
  return bindGachaShardShopInteractions;
}
