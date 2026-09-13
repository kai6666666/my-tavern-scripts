// @ts-nocheck
/**
 * apply-stored-panel-height.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createApplyStoredPanelHeight(deps: any) {
  const applyStoredPanelHeight = ($panel: JQuery<HTMLElement>, panelKey: unknown): number | null => {
    const savedHeight = deps.getStoredPanelHeight(panelKey);
    if (!savedHeight) {
      deps.clearPanelRequestedHeight($panel);
      return null;
    }
    return deps.setPanelRequestedHeight($panel, savedHeight);
  };
  return applyStoredPanelHeight;
}
