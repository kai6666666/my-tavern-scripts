// @ts-nocheck
/**
 * get-panel-display-max-height.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetPanelDisplayMaxHeight(deps: any) {
  const getPanelDisplayMaxHeight = ($panel?: JQuery<HTMLElement>): number => {
    const panelEl = $panel?.[0];
    const panelDocument = panelEl?.ownerDocument || deps.getTavernHostDocument();
    const panelWindow = panelDocument.defaultView || deps.getTavernHostWindow();
    const viewport = panelWindow.visualViewport;
    const viewportTop = viewport?.offsetTop ?? 0;
    const viewportHeight = viewport?.height || panelWindow.innerHeight || panelDocument.documentElement.clientHeight || 600;
    const viewportMaxHeight = Math.max(120, Math.floor(viewportHeight - deps.getPANEL_VIEWPORT_TOP_GUTTER()));
    if (!panelEl) return Math.min(deps.getMAX_PANEL_HEIGHT(), viewportMaxHeight);

    const rect = panelEl.getBoundingClientRect();
    const availableAbovePanel = Math.floor(rect.bottom - viewportTop - deps.getPANEL_VIEWPORT_TOP_GUTTER());
    const availableHeight =
      availableAbovePanel > 0 ? Math.min(viewportMaxHeight, availableAbovePanel) : viewportMaxHeight;
    return Math.max(120, Math.min(deps.getMAX_PANEL_HEIGHT(), availableHeight));
  };
  return getPanelDisplayMaxHeight;
}
