// @ts-nocheck
/**
 * clear-panel-requested-height.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createClearPanelRequestedHeight(deps: any) {
  const clearPanelRequestedHeight = ($panel: JQuery<HTMLElement>): void => {
    if (!$panel?.length) return;
    deps.applyPanelDisplayMaxHeight($panel);
    $panel.css('height', '').removeClass('acu-manual-mode').removeAttr('data-acu-requested-height');
  };
  return clearPanelRequestedHeight;
}
