// @ts-nocheck
/**
 * update-runtime-data-cache-after-crud.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createUpdateRuntimeDataCacheAfterCrud(deps: any) {
  const updateRuntimeDataCacheAfterCrud = (api, fallbackData: unknown, tableKey: string) => {
    const latestData = deps.getTableData({ silent: true });
    const refreshedEntry = deps.findRuntimeSheetEntryForMutation(latestData, tableKey);
    const fallbackEntry = deps.findRuntimeSheetEntryForMutation(fallbackData, tableKey);
    deps.setCachedRawData(!fallbackEntry?.sheet || refreshedEntry?.sheet ? latestData || fallbackData : fallbackData);
    api._notifyTableUpdate?.();
    return deps.getCachedRawData();
  };
  return updateRuntimeDataCacheAfterCrud;
}
