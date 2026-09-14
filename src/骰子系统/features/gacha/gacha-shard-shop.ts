// @ts-nocheck
/**
 * gacha-shard-shop.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createShowGachaShardShop(deps: any) {
  const showGachaShardShop = async () => {
    const { $ } = deps.getCore();
    $('.acu-gacha-shard-shop-overlay').remove();
    const rawData = deps.getCachedRawData() || deps.getTableData();
    await deps.ensureGachaCatalogLoaded(rawData);
    const overlay = $(deps.renderGachaShardShopHtml(rawData));
    $('body').append(overlay);
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
      overlayEl.style.setProperty('z-index', '31320', 'important');
    }
    deps.bindGachaShardShopInteractions(overlay as JQuery<HTMLElement>);
    deps.hydrateCustomTableNameIconsIn(overlay);
    deps.setupOverlayClose(overlay, 'acu-inventory-detail-overlay', () => overlay.remove());
  };
  return showGachaShardShop;
}
