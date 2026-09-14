// @ts-nocheck
/**
 * set-panel-requested-height.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createSetPanelRequestedHeight(deps: any) {
  const setPanelRequestedHeight = ($panel: JQuery<HTMLElement>, height: unknown): number | null => {
    if (!$panel?.length) return null;
    const displayMaxHeight = deps.getPanelDisplayMaxHeight($panel);
    const normalizedHeight = deps.clampPanelHeightToDisplay($panel, height, displayMaxHeight);
    $panel[0].style.setProperty('max-height', `${displayMaxHeight}px`, 'important');
    if (!normalizedHeight) {
      deps.clearPanelRequestedHeight($panel);
      return null;
    }
    $panel
      .css('height', `${normalizedHeight}px`)
      .addClass('acu-manual-mode')
      .attr('data-acu-requested-height', String(normalizedHeight));
    return normalizedHeight;
  };
  return setPanelRequestedHeight;
}
