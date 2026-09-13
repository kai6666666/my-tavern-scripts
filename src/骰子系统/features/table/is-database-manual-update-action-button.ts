// @ts-nocheck
/**
 * is-database-manual-update-action-button.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createIsDatabaseManualUpdateActionButton(deps: any) {
  const isDatabaseManualUpdateActionButton = (button: HTMLButtonElement): boolean => {
    const buttonText = deps.normalizeDatabaseUiText(button.textContent);
    if (deps.isDatabaseManualUpdateButtonText(buttonText)) return true;

    const inManualPanel = !!button.closest(deps.getACU_DATABASE_MANUAL_UPDATE_PANEL_SELECTOR());
    const inManualActions = !!button.closest('.acu-v2-form-fill-page__actions');
    return inManualPanel && inManualActions;
  };
  return isDatabaseManualUpdateActionButton;
}
