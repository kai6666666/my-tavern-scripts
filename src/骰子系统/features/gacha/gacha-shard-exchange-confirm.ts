// @ts-nocheck
/**
 * gacha-shard-exchange-confirm.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createShowGachaShardExchangeConfirm(deps: any) {
  const showGachaShardExchangeConfirm = (itemId: string) => {
    const { $ } = deps.getCore();
    const config = deps.getConfig();
    const rawData = deps.getCachedRawData() || deps.getTableData();
    const item = deps.getAllGachaItemDefinitions(rawData).find(definition => definition.id === itemId);
    if (!item) return;
    if (!deps.isGachaItemEnabled(item)) {
      if (window.toastr) window.toastr.warning('这个物品已禁用，暂时无法兑换');
      return;
    }
    const state = deps.getGachaState(rawData, true) || deps.createDefaultGachaState();
    const balance = Math.max(0, Math.floor(Number(state.wallet.shards[item.quality] || 0)));
    if (balance < deps.GACHA_SHARD_EXCHANGE_COST) {
      if (window.toastr) window.toastr.warning(`${deps.getGachaShardLabel(item.quality)}不足`);
      return;
    }
    if (deps.isGachaItemOwned(rawData, item) && (item.unique || !item.stackable)) {
      if (window.toastr)
        window.toastr.warning(`这个物品已在${deps.formatGachaRewardDestinationLabel(rawData, item)}中拥有，不能重复兑换`);
      return;
    }

    const targetLabel = deps.formatGachaRewardDestinationLabel(rawData, item);
    const customFieldsDetailsHtml = deps.renderGachaCustomFieldsDetailsHtml(item, { openThreshold: 2 });

    $('.acu-gacha-shard-confirm-overlay').remove();
    const overlay = $(`
      <div class="acu-gacha-shard-confirm-overlay acu-theme-${config.theme}">
        <div class="acu-gacha-shard-confirm">
          <div class="acu-gacha-shard-confirm-head">
            <div class="acu-gacha-shard-confirm-icon">${deps.renderGachaItemIconContent(item, deps.getGachaItemCustomTableNameIconContext(item))}</div>
            <div class="acu-gacha-shard-confirm-text">
              <strong>兑换 ${deps.escapeHtml(item.name)}</strong>
              <span><i class="fa-solid ${deps.getGachaRarityIconClass(item.quality)}"></i> ${deps.escapeHtml(String(deps.GACHA_SHARD_EXCHANGE_COST))} / 持有 ${deps.escapeHtml(String(balance))}</span>
              <small>将写入${deps.escapeHtml(targetLabel)}${deps.hasGachaCustomFields(item) ? '，包含自定义字段' : ''}</small>
            </div>
          </div>
          ${customFieldsDetailsHtml}
          <div class="acu-gacha-shard-confirm-actions">
            <button class="acu-gacha-shard-confirm-btn secondary" type="button" data-action="cancel">取消</button>
            <button class="acu-gacha-shard-confirm-btn primary" type="button" data-action="confirm">兑换</button>
          </div>
        </div>
      </div>
    `);
    $('body').append(overlay);
    deps.hydrateCustomTableNameIconsIn(overlay);
    const overlayEl = overlay[0] as HTMLElement | undefined;
    if (overlayEl) {
      overlayEl.style.setProperty('position', 'fixed', 'important');
      overlayEl.style.setProperty('top', '0', 'important');
      overlayEl.style.setProperty('left', '0', 'important');
      overlayEl.style.setProperty('right', '0', 'important');
      overlayEl.style.setProperty('bottom', '0', 'important');
      overlayEl.style.setProperty('width', '100vw', 'important');
      overlayEl.style.setProperty('height', '100dvh', 'important');
      overlayEl.style.setProperty('display', 'flex', 'important');
      overlayEl.style.setProperty('justify-content', 'center', 'important');
      overlayEl.style.setProperty('align-items', 'center', 'important');
      overlayEl.style.setProperty('z-index', '31360', 'important');
    }
    deps.setupOverlayClose(overlay, 'acu-gacha-shard-confirm-overlay', () => overlay.remove());
    overlay.on('click', '.acu-gacha-shard-confirm-btn', function (event) {
      event.stopPropagation();
      const action = String($(this).data('action') || '');
      overlay.remove();
      if (action === 'confirm') void deps.exchangeGachaShardItem(itemId);
    });
  };
  return showGachaShardExchangeConfirm;
}
