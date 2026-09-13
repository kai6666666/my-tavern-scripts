// @ts-nocheck
/**
 * save-stored-gacha-catalog.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { GACHA_CATALOG_VERSION } from '../../entities/gacha-items';
import { GachaCatalogDB } from './gacha-catalog-db';
import type { GachaCatalog } from '../../features/gacha/gacha-types';
import type { GachaItemDefinition } from '../../entities/gacha-items';
export function createSaveStoredGachaCatalog(deps: any) {
  const saveStoredGachaCatalog = async (items: GachaItemDefinition[]): Promise<GachaCatalog | null> => {
    const scopeKey = deps.getGachaCatalogScopeKey();
    const catalog: GachaCatalog = {
      version: GACHA_CATALOG_VERSION,
      items: deps.cloneGachaCatalogItems(items),
      updatedAt: Date.now(),
    };
    const saved = await GachaCatalogDB.put({
      scopeKey,
      version: catalog.version,
      items: deps.cloneGachaCatalogItems(catalog.items),
      updatedAt: catalog.updatedAt,
    });
    if (!saved) return null;
    deps.setGachaCatalogCache({ scopeKey, catalog });
    return catalog;
  };
  return saveStoredGachaCatalog;
}
