// @ts-nocheck
/**
 * get-panel-drag-start-height.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetPanelDragStartHeight(deps: any) {
  const getPanelDragStartHeight = ($panel: JQuery<HTMLElement>): number => {
    return (
      deps.clampPanelHeightToDisplay($panel, $panel.attr('data-acu-requested-height')) ||
      deps.clampPanelHeightToDisplay($panel, $panel.css('height')) ||
      deps.clampPanelHeightToDisplay($panel, $panel.height()) ||
      deps.getMIN_PANEL_HEIGHT()
    );
  };
  return getPanelDragStartHeight;
}
