// @ts-nocheck
/**
 * click-database-new-ui-form-fill-navigation.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createClickDatabaseNewUiFormFillNavigation(deps: any) {
  const clickDatabaseNewUiFormFillNavigation = (): boolean => {
    for (const targetWindow of deps.collectAccessibleRuntimeWindows()) {
      const targetDocument = deps.getAccessibleDocument(targetWindow);
      const navButton = targetDocument?.querySelector<HTMLElement>(deps.getACU_DATABASE_FORM_FILL_NAV_SELECTOR());
      if (!navButton || typeof navButton.click !== 'function') continue;
      if (!deps.isElementVisibleInLayout(navButton)) continue;

      navButton.click();
      return true;
    }

    return false;
  };
  return clickDatabaseNewUiFormFillNavigation;
}
