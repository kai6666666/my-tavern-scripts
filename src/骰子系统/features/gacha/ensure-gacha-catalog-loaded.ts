// @ts-nocheck
/**
 * ensure-gacha-catalog-loaded.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaCatalog } from '../../features/gacha/gacha-types';
export function createEnsureGachaCatalogLoaded(deps: any) {
  const ensureGachaCatalogLoaded = async (_rawData?: unknown): Promise<GachaCatalog> => {
    const scopeKey = deps.getGachaCatalogScopeKey();
    if (deps.getGachaCatalogCache()?.scopeKey === scopeKey) return deps.getGachaCatalogCache().catalog;
    if (deps.getGachaCatalogLoadTask()?.scopeKey === scopeKey) return deps.getGachaCatalogLoadTask().promise;

    const loadPromise = (async (): Promise<GachaCatalog> => {
      const catalog = await deps.migrateGachaCatalogRecordsToGlobalScope();
      deps.setGachaCatalogCache({ scopeKey, catalog });
      return catalog;
    })();

    deps.setGachaCatalogLoadTask({ scopeKey, promise: loadPromise });
    try {
      return await loadPromise;
    } finally {
      if (deps.getGachaCatalogLoadTask()?.scopeKey === scopeKey) deps.setGachaCatalogLoadTask(null);
    }
  };
  return ensureGachaCatalogLoaded;
}
