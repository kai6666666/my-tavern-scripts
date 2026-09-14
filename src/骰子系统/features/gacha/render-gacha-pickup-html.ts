// @ts-nocheck
/**
 * render-gacha-pickup-html.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaPoolTag } from '../../entities/gacha-items';
export function createRenderGachaPickupHtml(deps: any) {
  const renderGachaPickupHtml = (poolTag: GachaPoolTag): string => {
    const pickupItems = deps.getGachaPickupItems(poolTag);
    if (pickupItems.length === 0) return '';
    return `
      <section class="acu-gacha-pickup-section">
        <div class="acu-gacha-pickup-title"><i class="fa-solid fa-bullhorn"></i><span>PICK UP</span></div>
        <div class="acu-gacha-pickup-grid">
          ${pickupItems
            .map(item => {
              const customIconContext = deps.getGachaItemCustomTableNameIconContext(item);
              return `
<button class="acu-gacha-pickup-card acu-gacha-pickup-detail-btn" type="button" data-item-id="${deps.escapeHtml(item.id)}">
                    <span class="acu-gacha-pickup-rarity">${deps.escapeHtml(item.quality)}</span>
                    <strong><span class="acu-gacha-pickup-card-icon">${deps.renderGachaItemIconContent(item, customIconContext)}</span><span>${deps.escapeHtml(item.name)}</span></strong>
                    <span class="acu-gacha-item-card-meta">${deps.escapeHtml(deps.formatGachaItemCardMeta(item))}</span>
                    <span class="acu-gacha-item-card-effect"><b>效果</b>${deps.escapeHtml(deps.getGachaItemEffectText(item) || '暂无效果')}</span>
                    <span class="acu-gacha-item-card-description"><b>描述</b>${deps.escapeHtml(deps.getGachaItemDescriptionText(item) || '暂无描述')}</span>
                    ${deps.renderGachaCustomFieldsPreviewHtml(item, { limit: 2, showOverflowCount: true })}
                  </button>
               `;
            })
            .join('')}
        </div>
      </section>
    `;
  };
  return renderGachaPickupHtml;
}
