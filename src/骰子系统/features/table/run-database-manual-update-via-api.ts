// @ts-nocheck
/**
 * run-database-manual-update-via-api.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createRunDatabaseManualUpdateViaApi(deps: any) {
  const runDatabaseManualUpdateViaApi = async (options?: {
    includeLegacyApi?: boolean;
  }): Promise<DatabaseManualUpdateResult> => {
    let failedResult: DatabaseManualUpdateResult | null = null;
    const includeLegacyApi = options?.includeLegacyApi !== false;

    for (const targetWindow of deps.collectAccessibleRuntimeWindows()) {
      const apiEntries = [
        { source: '新版数据库 manualUpdate API', api: (targetWindow as any).AutoCardUpdaterV2API },
        ...(includeLegacyApi
          ? [{ source: '旧版数据库 manualUpdate API', api: (targetWindow as any).AutoCardUpdaterAPI }]
          : []),
      ];

      for (const { source, api } of apiEntries) {
        if (!api || typeof api !== 'object') continue;

        for (const methodName of deps.ACU_DATABASE_MANUAL_UPDATE_API_METHODS) {
          const method = api[methodName];
          if (typeof method !== 'function') continue;

          const result = await deps.runMaybeAsyncDatabaseManualUpdate(() => method.call(api), `${source}.${methodName}`);
          if (result.status === 'updated') return result;
          failedResult = result;
        }
      }
    }

    return failedResult || { status: 'unavailable' };
  };
  return runDatabaseManualUpdateViaApi;
}
