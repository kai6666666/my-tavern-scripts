// @ts-nocheck
/**
 * get-stored-gacha-catalog.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaCatalog } from './gacha-types';
export function createGetStoredGachaCatalog(deps: any) {
  const getStoredGachaCatalog = (_rawData, createIfMissing = false): GachaCatalog | null => {
    const scopeKey = deps.getGachaCatalogScopeKey();
    if (deps.getGachaCatalogCache()?.scopeKey === scopeKey) return deps.getGachaCatalogCache().catalog;
    return createIfMissing ? deps.createEmptyGachaCatalog() : null;
  };
  return getStoredGachaCatalog;
}
