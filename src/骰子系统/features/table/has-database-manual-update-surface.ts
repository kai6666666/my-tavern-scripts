// @ts-nocheck
/**
 * has-database-manual-update-surface.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createHasDatabaseManualUpdateSurface(deps: any) {
  const hasDatabaseManualUpdateSurface = (): boolean => {
    for (const targetWindow of deps.collectAccessibleRuntimeWindows()) {
      const targetDocument = deps.getAccessibleDocument(targetWindow);
      if (!targetDocument) continue;

      const panel = targetDocument.querySelector<HTMLElement>(deps.getACU_DATABASE_MANUAL_UPDATE_PANEL_SELECTOR());
      if (panel && deps.isElementVisibleInLayout(panel)) return true;

      const manualButton = Array.from(
        targetDocument.querySelectorAll<HTMLButtonElement>(deps.getACU_DATABASE_MANUAL_UPDATE_ACTION_SELECTOR()),
      ).find(button => deps.isElementVisibleInLayout(button) && deps.isDatabaseManualUpdateActionButton(button));
      if (manualButton) return true;
    }

    return false;
  };
  return hasDatabaseManualUpdateSurface;
}
