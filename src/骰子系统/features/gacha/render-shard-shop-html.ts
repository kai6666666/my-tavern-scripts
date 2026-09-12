// @ts-nocheck
/**
 * render-shard-shop-html.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { GACHA_RARITY_ORDER } from '../../entities/gacha-items';
export function createRenderGachaShardShopHtml(deps: any) {
  const renderGachaShardShopHtml = rawData => {
    const config = deps.getConfig();
    const horizontalScrollbarClass = config.showHorizontalScrollbar === true ? 'acu-show-horizontal-scrollbar' : '';
    const state = deps.getGachaState(rawData, true) || deps.createDefaultGachaState();
    const activePoolTag = deps.getGachaActivePoolTag(state);
    const activeRarity = deps.getStoredGachaShardShopRarity();
    const poolTabsHtml = deps.getVisibleGachaPoolConfigDefinitions(rawData)
      .map(pool => {
        const isActive = activePoolTag === pool.id;
        return `
          <button
            class="acu-gacha-pool-tab acu-gacha-shard-pool-tab ${isActive ? 'active' : ''}"
            type="button"
            role="tab"
            aria-selected="${isActive ? 'true' : 'false'}"
            data-pool-tag="${deps.escapeHtml(pool.id)}"
            title="${deps.escapeHtml(pool.name)}"
          >
            <i class="fa-solid fa-tags"></i>
            <span>${deps.escapeHtml(pool.name)}</span>
          </button>
        `;
      })
      .join('');
    const rarityTabsHtml = GACHA_RARITY_ORDER.map(rarity => {
      const isActive = activeRarity === rarity;
      const shardCount = Math.max(0, Math.floor(Number(state.wallet.shards[rarity] || 0)));
      return `
        <button
          class="acu-gacha-shard-tab ${isActive ? 'active' : ''}"
          type="button"
          data-rarity="${deps.escapeHtml(rarity)}"
          aria-label="${deps.escapeHtml(`${rarity}碎片 ${String(shardCount)}`)}"
          aria-pressed="${isActive ? 'true' : 'false'}"
          title="${deps.escapeHtml(`${rarity}碎片 ${String(shardCount)}`)}"
        >
          <i class="fa-solid ${deps.getGachaRarityIconClass(rarity)}"></i>
          <strong>${deps.escapeHtml(String(shardCount))}</strong>
        </button>
      `;
    }).join('');
    const items = deps.getGachaPoolDefinitions(activePoolTag, rawData)
      .filter(item => item.quality === activeRarity)
      .sort(deps.compareGachaItemDefinitionsForDisplay);
    const itemCardsHtml =
      items.length > 0
        ? items
            .map(item => {
              const owned = deps.isGachaItemOwned(rawData, item);
              const balance = Math.max(0, Math.floor(Number(state.wallet.shards[item.quality] || 0)));
              const canAfford = balance >= deps.GACHA_SHARD_EXCHANGE_COST;
              const ownedBlocked = owned && (item.unique || !item.stackable);
              const disabled = !canAfford || ownedBlocked;
              const statusHtml = ownedBlocked ? '<span class="acu-gacha-shard-owned">已拥有</span>' : '';
              return `
                <article
                  class="acu-gacha-shard-item-card ${disabled ? 'is-disabled' : 'is-available'} ${ownedBlocked ? 'is-owned' : ''}"
                  data-item-id="${deps.escapeHtml(item.id)}"
                >
                  <button
                    class="acu-gacha-shard-price acu-gacha-shard-buy-btn"
                    type="button"
                    data-item-id="${deps.escapeHtml(item.id)}"
                    title="${deps.escapeHtml(`兑换：${deps.GACHA_SHARD_EXCHANGE_COST}${deps.getGachaShardLabel(item.quality)}`)}"
                    aria-label="${deps.escapeHtml(`兑换 ${item.name}`)}"
                    aria-disabled="${disabled ? 'true' : 'false'}"
                  >
                    <i class="fa-solid ${deps.getGachaRarityIconClass(item.quality)}"></i>
                    <strong>${deps.escapeHtml(String(deps.GACHA_SHARD_EXCHANGE_COST))}</strong>
                  </button>
                  ${statusHtml}
                  <button class="acu-gacha-shard-card-main acu-gacha-shard-detail-btn" type="button" data-item-id="${deps.escapeHtml(item.id)}" aria-label="${deps.escapeHtml(`查看 ${item.name}`)}">
                    <span class="acu-gacha-shard-item-icon">${deps.renderGachaItemIconContent(item, deps.getGachaItemCustomTableNameIconContext(item, rawData))}</span>
                    <span class="acu-gacha-shard-item-main">
                    <span class="acu-gacha-shard-item-head">
                      <strong>${deps.escapeHtml(item.name)}</strong>
                      <span>${deps.escapeHtml(deps.formatGachaItemCardMeta(item))}</span>
                    </span>
                    <span class="acu-gacha-shard-item-effect"><b>效果</b>${deps.escapeHtml(deps.getGachaItemEffectText(item) || '暂无效果')}</span>
                    <span class="acu-gacha-shard-item-desc"><b>描述</b>${deps.escapeHtml(deps.getGachaItemDescriptionText(item) || '暂无描述')}</span>
                    ${deps.renderGachaCustomFieldsPreviewHtml(item, { limit: 2, showOverflowCount: true })}
                    </span>
                  </button>
                </article>
              `;
            })
            .join('')
        : `<div class="acu-inventory-empty compact"><i class="fa-solid fa-cubes-stacked"></i><span>${deps.escapeHtml(deps.getGachaPoolDisplayName(activePoolTag, rawData))} · ${deps.escapeHtml(activeRarity)} 暂无可兑换物品</span></div>`;

    return `
      <div class="acu-inventory-detail-overlay acu-theme-${config.theme} acu-gacha-shard-shop-overlay ${horizontalScrollbarClass}">
        <div class="acu-inventory-detail acu-gacha-shard-shop">
          <div class="acu-inventory-detail-header">
            <div class="acu-inventory-detail-head-main">
              <div class="acu-inventory-detail-icon"><i class="fa-solid fa-cubes-stacked"></i></div>
              <div class="acu-inventory-detail-summary">
                <div class="acu-inventory-detail-title-row">
                <div class="acu-inventory-detail-title">碎片商城</div>
              </div>
              </div>
            </div>
            <div class="acu-inventory-detail-header-actions">
              ${deps.getTutorialButtonHtml('shardShop', '查看碎片商城教程')}
              <button class="acu-preview-close acu-gacha-shard-shop-close" type="button" title="关闭" aria-label="关闭碎片商城"><i class="fa-solid fa-times"></i></button>
            </div>
          </div>
          <div class="acu-gacha-shard-pool-tabs acu-gacha-pool-tabs" role="tablist">${poolTabsHtml}</div>
          <div class="acu-gacha-shard-tabs" role="tablist">${rarityTabsHtml}</div>
          <div class="acu-gacha-shard-items">${itemCardsHtml}</div>
        </div>
      </div>
    `;
  };
  return renderGachaShardShopHtml;
}
