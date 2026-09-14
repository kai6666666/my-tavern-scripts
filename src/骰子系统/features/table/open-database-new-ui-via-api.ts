// @ts-nocheck
/**
 * open-database-new-ui-via-api.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createOpenDatabaseNewUiViaApi(deps: any) {
  const openDatabaseNewUiViaApi = async (): Promise<boolean> => {
    for (const targetWindow of deps.collectAccessibleRuntimeWindows()) {
      const api = (targetWindow as any).AutoCardUpdaterV2API;
      if (!api || typeof api !== 'object') continue;

      for (const methodName of deps.getACU_DATABASE_NEW_UI_API_METHODS()) {
        const method = api[methodName];
        if (typeof method !== 'function') continue;
        const opened = await deps.runMaybeAsyncDatabaseUiOpener(() => method.call(api), '数据库新 UI 入口');
        if (opened) return true;
      }
    }

    return false;
  };
  return openDatabaseNewUiViaApi;
}
