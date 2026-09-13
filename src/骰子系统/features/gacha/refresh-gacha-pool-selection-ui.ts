// @ts-nocheck
/**
 * refresh-gacha-pool-selection-ui.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaPoolTag } from '../../entities/gacha-items';
export function createRefreshGachaPoolSelectionUi(deps: any) {
  const refreshGachaPoolSelectionUi = (poolTag: GachaPoolTag) => {
    const { $ } = deps.getCore();
    const $overlay = $('.acu-gacha-overlay');
    if (!$overlay.length) return;

    $overlay.find('.acu-gacha-pool-btn').each(function () {
      const $button = $(this);
      const isActive = String($button.data('pool-tag') || '') === poolTag;
      $button.toggleClass('active', isActive).attr('aria-selected', isActive ? 'true' : 'false');
    });

    const pickupHtml = deps.renderGachaPickupHtml(poolTag);
    const $pickup = $overlay.find('.acu-gacha-pickup-section').first();
    if ($pickup.length) {
      $pickup.replaceWith(pickupHtml);
    } else if (pickupHtml) {
      $overlay.find('.acu-gacha-pool-tabs').first().after(pickupHtml);
    }
  };
  return refreshGachaPoolSelectionUi;
}
