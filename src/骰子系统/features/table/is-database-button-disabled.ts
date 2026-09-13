// @ts-nocheck
/**
 * is-database-button-disabled.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createIsDatabaseButtonDisabled(deps: any) {
  const isDatabaseButtonDisabled = (button: HTMLButtonElement): boolean =>
    button.disabled || button.getAttribute('aria-disabled') === 'true';

  const hasDatabaseNewUiRuntime = (): boolean => {
    for (const targetWindow of collectAccessibleRuntimeWindows()) {
      const api = (targetWindow as any).AutoCardUpdaterV2API;
      if (api && typeof api === 'object') return true;

      const targetDocument = getAccessibleDocument(targetWindow);
      if (targetDocument?.querySelector(ACU_DATABASE_V2_ROOT_SELECTOR)) return true;
      if (targetDocument?.querySelector(ACU_DATABASE_NEW_UI_MENU_SELECTOR)) return true;
    }

    return false;
  };
  return isDatabaseButtonDisabled;
}
