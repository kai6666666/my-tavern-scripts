// @ts-nocheck
/**
 * has-database-new-ui-runtime.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createHasDatabaseNewUiRuntime(deps: any) {
  const hasDatabaseNewUiRuntime = (): boolean => {
    for (const targetWindow of deps.collectAccessibleRuntimeWindows()) {
      const api = (targetWindow as any).AutoCardUpdaterV2API;
      if (api && typeof api === 'object') return true;
      const targetDocument = deps.getAccessibleDocument(targetWindow);
      if (targetDocument?.querySelector(deps.getACU_DATABASE_V2_ROOT_SELECTOR())) return true;
      if (targetDocument?.querySelector(deps.getACU_DATABASE_NEW_UI_MENU_SELECTOR())) return true;
    }
    return false;
  };
  return hasDatabaseNewUiRuntime;
}
