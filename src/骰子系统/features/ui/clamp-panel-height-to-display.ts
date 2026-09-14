// @ts-nocheck
/**
 * clamp-panel-height-to-display.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createClampPanelHeightToDisplay(deps: any) {
  const clampPanelHeightToDisplay = (
    $panel: JQuery<HTMLElement>,
    height: unknown,
    displayMaxHeight?: number,
  ): number | null => {
    const rawHeight = Number.parseInt(String(height ?? ''), 10);
    if (!Number.isFinite(rawHeight)) return null;
    const normalizedHeight = Math.max(deps.getMIN_PANEL_HEIGHT(), Math.min(deps.getMAX_PANEL_HEIGHT(), rawHeight));
    const effectiveMaxHeight =
      typeof displayMaxHeight === 'number' && Number.isFinite(displayMaxHeight)
        ? displayMaxHeight
        : deps.getPanelDisplayMaxHeight($panel);
    return Math.max(deps.getMIN_PANEL_HEIGHT(), Math.min(effectiveMaxHeight, normalizedHeight));
  };
  return clampPanelHeightToDisplay;
}
