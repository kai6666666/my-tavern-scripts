// @ts-nocheck
/**
 * get-gacha-catalog-scope-key.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetGachaCatalogScopeKey(deps: any) {
  const getGachaCatalogScopeKey = (): string => deps.getGACHA_CATALOG_GLOBAL_SCOPE_KEY();
  return getGachaCatalogScopeKey;
}
