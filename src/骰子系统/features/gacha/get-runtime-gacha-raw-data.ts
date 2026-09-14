// @ts-nocheck
/**
 * get-runtime-gacha-raw-data.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetRuntimeGachaRawData(deps: any) {
  const getRuntimeGachaRawData = () => deps.getCachedRawData() || deps.getTableData();
  const getGachaCatalogScopeKey = (): string => GACHA_CATALOG_GLOBAL_SCOPE_KEY;
  return getRuntimeGachaRawData;
}
