// @ts-nocheck
/**
 * render-gacha-panel-html.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { FORTUNE_CURRENCY_NAME, GACHA_DRAW_COST_SINGLE, GACHA_DRAW_COST_TEN, GACHA_LEGEND_PITY_THRESHOLD, GACHA_RARE_PITY_THRESHOLD } from '../../entities/gacha-items';
export function createRenderGachaPanelHtml(deps: any) {
  const renderGachaPanelHtml = rawData => {
    const config = deps.getConfig();
    const horizontalScrollbarClass = config.showHorizontalScrollbar === true ? 'acu-show-horizontal-scrollbar' : '';
    const state = deps.getGachaState(rawData, true) || deps.createDefaultGachaState();
    const activePoolTag = deps.getGachaActivePoolTag(state);
    const inventoryTable = deps.parseInventoryItems(rawData);
    const recentSummary =
      state.recentRewards.length > 0
        ? `最近 ${Math.min(state.recentRewards.length, 6)} 条：${deps.formatGachaRecentRewardText(state.recentRewards[0])}`
        : '还没有最近抽取记录';
    const recentRewardsHtml =
      state.recentRewards.length > 0
        ? state.recentRewards
            .slice(0, 6)
            .map(
              reward => `
                <button class="acu-gacha-recent-detail-btn" type="button" data-item-id="${deps.escapeHtml(reward.itemId)}" data-item-name="${deps.escapeHtml(reward.name)}" data-item-quality="${deps.escapeHtml(reward.quality)}" title="${deps.escapeHtml(`查看 ${reward.name}`)}">
                  <span class="acu-gacha-recent-reward-text">${deps.escapeHtml(deps.formatGachaRecentRewardText(reward))}</span>
                  <span class="acu-gacha-recent-quality">${deps.escapeHtml(reward.quality)}</span>
                </button>
              `,
            )
            .join('')
        : `<div class="acu-inventory-empty compact"><i class="fa-solid fa-receipt"></i><span>还没有最近抽取记录</span></div>`;
    const totalShards = deps.getTotalGachaShards(state);
    const poolDefinitions = deps.getVisibleGachaPoolConfigDefinitions(rawData);

    const poolButtonsHtml = poolDefinitions
      .map(pool => {
        const isActive = activePoolTag === pool.id;
        return `
        <button
          class="acu-gacha-pool-tab acu-gacha-pool-btn ${isActive ? 'active' : ''}"
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

    return `
      <div class="acu-gacha-shell acu-theme-${config.theme} ${horizontalScrollbarClass}">
        <div class="acu-panel-header acu-inventory-window-header">
          <div class="acu-panel-title">
            <div class="acu-title-main"><i class="fa-solid fa-store"></i> <span class="acu-title-text">骰子商店</span></div>
          </div>
          <div class="acu-header-actions">
            ${deps.getTutorialButtonHtml('gacha', '查看骰子商店教程')}
            <button class="acu-view-btn acu-gacha-settings-open" type="button" title="骰子商城设置" aria-label="骰子商城设置">
              <i class="fa-solid fa-gear"></i>
            </button>
            <button class="acu-view-btn acu-gacha-inventory-open" type="button" title="打开物品栏" aria-label="打开物品栏">
              <i class="fa-solid fa-box-open"></i>
            </button>
            ${
              inventoryTable.tableKey
                ? `<button class="acu-view-btn acu-gacha-open-table" type="button" data-table="${deps.escapeHtml(inventoryTable.tableName)}" title="跳转到物品表" aria-label="跳转到物品表">
              <i class="fa-solid fa-table"></i>
            </button>`
                : ''
            }
            <button class="acu-close-btn acu-gacha-close" type="button" title="关闭" aria-label="关闭骰子商店"><i class="fa-solid fa-times"></i></button>
          </div>
        </div>
        <div class="acu-gacha-content">
          <div class="acu-gacha-stat-row">
            <span class="acu-badge acu-gacha-fortune-badge"><i class="fa-solid fa-coins"></i>${deps.escapeHtml(FORTUNE_CURRENCY_NAME)} <strong class="acu-gacha-fortune-amount">${deps.escapeHtml(String(state.wallet.fortune || 0))}</strong></span>
            <button class="acu-dialog-btn acu-gacha-fortune-clear danger" type="button" title="清空当前骰运余额" aria-label="清空当前骰运余额">
              <i class="fa-solid fa-eraser"></i>
              <span>清零</span>
            </button>
            <span class="acu-badge"><i class="fa-solid fa-gem"></i>稀有保底 ${deps.escapeHtml(String(state.pity.rare || 0))}/${deps.escapeHtml(String(GACHA_RARE_PITY_THRESHOLD))}</span>
            <span class="acu-badge"><i class="fa-solid fa-star"></i>传说保底 ${deps.escapeHtml(String(state.pity.legend || 0))}/${deps.escapeHtml(String(GACHA_LEGEND_PITY_THRESHOLD))}</span>
            <button class="acu-dialog-btn acu-gacha-shard-shop-open" type="button" title="打开碎片商城">
              <i class="fa-solid fa-cubes-stacked"></i>
              <span>碎片商城</span>
              <strong class="acu-gacha-shard-total">${deps.escapeHtml(String(totalShards))}</strong>
            </button>
          </div>
          ${deps.renderGachaFortuneProgressHtml(state)}
          <div class="acu-gacha-pool-tabs" role="tablist">${poolButtonsHtml}</div>
          ${deps.renderGachaPickupHtml(activePoolTag)}
          <details class="acu-gacha-section acu-gacha-recent-section" open>
            <summary>
              <span><i class="fa-solid fa-clock-rotate-left"></i> 最近收获</span>
              <strong>${deps.escapeHtml(recentSummary)}</strong>
              <i class="fa-solid fa-chevron-down acu-gacha-recent-toggle"></i>
            </summary>
            <div class="acu-gacha-recent-list">${recentRewardsHtml}</div>
          </details>
        </div>
        <div class="acu-gacha-draw-row">
          <button class="acu-dialog-btn acu-btn-confirm acu-gacha-draw-btn acu-gacha-draw-single" type="button" data-draw-count="1">
            <i class="fa-solid fa-wand-sparkles"></i>
            <span>单抽</span>
            <strong>${GACHA_DRAW_COST_SINGLE}</strong>
          </button>
          <button class="acu-dialog-btn acu-btn-confirm acu-gacha-draw-btn acu-gacha-draw-ten" type="button" data-draw-count="10">
            <i class="fa-solid fa-fire"></i>
            <span>十连</span>
            <strong>${GACHA_DRAW_COST_TEN}</strong>
          </button>
        </div>
      </div>
    `;
  };
  return renderGachaPanelHtml;
}
