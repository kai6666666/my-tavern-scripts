// @ts-nocheck
/**
 * gacha-pickup-item-detail.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createShowGachaPickupItemDetail(deps: any) {
  const showGachaPickupItemDetail = (itemId: string): boolean => {
    const { $ } = deps.getCore();
    const config = deps.getConfig();
    const item = deps.findGachaDefinitionByItemId(itemId);
    if (!item) return false;

    const targetLabel = item.rewardTarget === 'equipment' ? '装备' : '物品';
    const destinationLabel = deps.formatGachaRewardDestinationLabel(deps.getCachedRawData() || deps.getTableData(), item);
    const stackableLabel = item.stackable ? '可堆叠' : '不可堆叠';
    const uniqueLabel = item.unique ? '唯一' : '可重复';
    const customIconContext = deps.getGachaItemCustomTableNameIconContext(item);
    const detail = $(`
      <div class="acu-inventory-detail-overlay acu-theme-${config.theme} acu-gacha-pickup-detail-overlay">
        <div class="acu-inventory-detail acu-gacha-pickup-detail">
          <div class="acu-inventory-detail-header">
            <div class="acu-inventory-detail-head-main">
              <div class="acu-inventory-detail-icon">${deps.renderGachaItemIconContent(item, customIconContext)}</div>
              <div class="acu-inventory-detail-summary">
                <div class="acu-inventory-detail-title-row">
                  <div class="acu-inventory-detail-title">${deps.escapeHtml(item.name)}</div>
                </div>
                <div class="acu-inventory-detail-sub">${deps.escapeHtml(deps.formatGachaItemCardMeta(item))}</div>
              </div>
            </div>
            <div class="acu-inventory-detail-header-actions">
              <button class="acu-preview-close" type="button" title="关闭" aria-label="关闭物品详情"><i class="fa-solid fa-times"></i></button>
            </div>
          </div>
          <div class="acu-inventory-detail-meta-wrap">
            <div class="acu-inventory-detail-meta">
              <div class="acu-inventory-detail-field-row acu-gacha-static-field-row">
                <span class="acu-inventory-detail-field-label">适用卡池</span>
                <span class="acu-inventory-detail-field-value">${deps.escapeHtml(deps.formatGachaPoolTags(item.poolTags))}</span>
              </div>
              <div class="acu-inventory-detail-field-row acu-gacha-static-field-row">
                <span class="acu-inventory-detail-field-label">发放目标</span>
                <span class="acu-inventory-detail-field-value">${deps.escapeHtml(targetLabel)}</span>
              </div>
              <div class="acu-inventory-detail-field-row acu-gacha-static-field-row">
                <span class="acu-inventory-detail-field-label">${item.targetTable ? '固定写入' : '默认写入'}</span>
                <span class="acu-inventory-detail-field-value">${deps.escapeHtml(destinationLabel)}</span>
              </div>
              <div class="acu-inventory-detail-field-row acu-gacha-static-field-row">
                <span class="acu-inventory-detail-field-label">规则</span>
                <span class="acu-inventory-detail-field-value">${deps.escapeHtml(`${stackableLabel} · ${uniqueLabel}`)}</span>
              </div>
            </div>
          </div>
          <div class="acu-gacha-detail-text-block">
            <div class="acu-gacha-detail-text-row"><strong>效果</strong><span>${deps.escapeHtml(deps.getGachaItemEffectText(item) || '暂无效果')}</span></div>
            <div class="acu-gacha-detail-text-row"><strong>描述</strong><span>${deps.escapeHtml(deps.getGachaItemDescriptionText(item) || '暂无描述')}</span></div>
          </div>
          ${deps.renderGachaCustomFieldsDetailsHtml(item, { openThreshold: 4 })}
        </div>
      </div>
    `);

    $('.acu-gacha-pickup-detail-overlay').remove();
    $('body').append(detail);
    deps.hydrateCustomTableNameIconsIn(detail);
    const detailEl = detail[0] as HTMLElement | undefined;
    if (detailEl) {
      detailEl.style.setProperty('position', 'fixed', 'important');
      detailEl.style.setProperty('top', '0', 'important');
      detailEl.style.setProperty('left', '0', 'important');
      detailEl.style.setProperty('right', '0', 'important');
      detailEl.style.setProperty('bottom', '0', 'important');
      detailEl.style.setProperty('width', '100vw', 'important');
      detailEl.style.setProperty('height', '100dvh', 'important');
      detailEl.style.setProperty('display', 'flex', 'important');
      detailEl.style.setProperty('justify-content', 'center', 'important');
      detailEl.style.setProperty('align-items', 'center', 'important');
      detailEl.style.setProperty('z-index', '31365', 'important');
    }
    deps.setupOverlayClose(detail, 'acu-inventory-detail-overlay', () => detail.remove());
    detail.on('click', '.acu-preview-close', () => detail.remove());
    return true;
  };
  return showGachaPickupItemDetail;
}
