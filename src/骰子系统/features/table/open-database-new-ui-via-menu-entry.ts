// @ts-nocheck
/**
 * open-database-new-ui-via-menu-entry.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createOpenDatabaseNewUiViaMenuEntry(deps: any) {
  const openDatabaseNewUiViaMenuEntry = (): boolean => {
    for (const targetWindow of deps.collectAccessibleRuntimeWindows()) {
      const targetDocument = deps.getAccessibleDocument(targetWindow);
      const menuItem = targetDocument?.querySelector<HTMLElement>(deps.getACU_DATABASE_NEW_UI_MENU_SELECTOR());
      if (!menuItem || typeof menuItem.click !== 'function') continue;

      menuItem.click();
      return true;
    }

    return false;
  };
  return openDatabaseNewUiViaMenuEntry;
}
