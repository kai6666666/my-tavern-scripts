// @ts-nocheck
/**
 * gacha-visualization.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createShowGachaVisualization(deps: any) {
  const showGachaVisualization = async () => {
    const { $ } = deps.getCore();
    deps.closeInventoryVisualization();
    deps.closeGachaVisualization();
    const rawData = deps.getCachedRawData() || deps.getTableData();
    await deps.ensureGachaCatalogLoaded(rawData);
    const overlay = $(`<div class="acu-gacha-overlay acu-theme-${deps.getConfig().theme}"></div>`);
    overlay.html(deps.renderGachaPanelHtml(rawData));
    $('body').append(overlay);
    deps.hydrateCustomTableNameIconsIn(overlay);
    deps.setGachaShopRootElement(overlay[0] as HTMLElement | null);
    deps.startGachaShopUiRefresh();
    deps.updateGachaShopProgressUi();
    const overlayEl = overlay[0] as HTMLElement | undefined;
    if (overlayEl) {
      overlayEl.style.setProperty('position', 'fixed', 'important');
      overlayEl.style.setProperty('top', '0', 'important');
      overlayEl.style.setProperty('left', '0', 'important');
      overlayEl.style.setProperty('right', '0', 'important');
      overlayEl.style.setProperty('bottom', '0', 'important');
      overlayEl.style.setProperty('width', '100vw', 'important');
      overlayEl.style.setProperty('height', '100vh', 'important');
      overlayEl.style.setProperty('display', 'flex', 'important');
      overlayEl.style.setProperty('justify-content', 'center', 'important');
      overlayEl.style.setProperty('align-items', 'center', 'important');
      overlayEl.style.setProperty('z-index', '31145', 'important');
    }
    deps.setupOverlayClose(overlay, 'acu-gacha-overlay', deps.closeGachaVisualization);
  };
  return showGachaVisualization;
}
