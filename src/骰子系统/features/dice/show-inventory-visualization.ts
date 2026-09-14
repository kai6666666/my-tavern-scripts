// @ts-nocheck
/**
 * show-inventory-visualization.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createShowInventoryVisualization(deps: any) {
  const showInventoryVisualization = (target?: 'inventory' | 'equipment') => {
    const { $ } = deps.getCore();
    deps.closeInventoryVisualization();
    deps.closeGachaVisualization();
    const panelTarget: 'inventory' | 'equipment' = target === 'equipment' ? 'equipment' : target === 'inventory' ? 'inventory' : deps.getInventoryPanelTarget();
    deps.saveInventoryPanelTarget(panelTarget);
    const rawData = deps.getCachedRawData() || deps.getTableData();
    const overlay = $(`<div class="acu-inventory-overlay acu-theme-${deps.getConfig().theme}"></div>`);
    overlay.html(deps.renderInventoryVisualization(rawData, panelTarget));
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
      overlayEl.style.setProperty('height', '100vh', 'important');
      overlayEl.style.setProperty('display', 'flex', 'important');
      overlayEl.style.setProperty('justify-content', 'center', 'important');
      overlayEl.style.setProperty('align-items', 'center', 'important');
      overlayEl.style.setProperty('z-index', '31140', 'important');
    }
    deps.setupOverlayClose(overlay, 'acu-inventory-overlay', deps.closeInventoryVisualization);
  };
  return showInventoryVisualization;
}
