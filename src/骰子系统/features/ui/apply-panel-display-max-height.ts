// @ts-nocheck
/**
 * apply-panel-display-max-height.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createApplyPanelDisplayMaxHeight(deps: any) {
  const applyPanelDisplayMaxHeight = ($panel: JQuery<HTMLElement>): void => {
    if (!$panel?.length) return;
    $panel[0].style.setProperty('max-height', `${deps.getPanelDisplayMaxHeight($panel)}px`, 'important');
  };
  return applyPanelDisplayMaxHeight;
}
