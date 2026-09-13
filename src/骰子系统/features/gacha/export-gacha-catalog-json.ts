// @ts-nocheck
/**
 * export-gacha-catalog-json.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { GACHA_ALL_POOL_TAG, normalizeGachaPoolId } from './gacha-helpers';
import { GACHA_CATALOG_EXPORT_KIND, GACHA_CATALOG_VERSION } from '../../entities/gacha-items';
import type { GachaPoolTag } from '../../entities/gacha-items';
export function createExportGachaCatalogJson(deps: any) {
  const exportGachaCatalogJson = (rawData, poolId?: GachaPoolTag): string => {
    const normalizedPoolId = normalizeGachaPoolId(poolId);
    const isPoolExport = Boolean(normalizedPoolId);
    const items = deps.getGachaCatalogItemsForExport(rawData, normalizedPoolId);
    if (!isPoolExport && items.length === 0) return deps.buildGachaCatalogTemplateJsonc();
    const pools = deps.getAllGachaPoolConfigDefinitions(rawData).filter(pool => {
      if (pool.id === GACHA_ALL_POOL_TAG) return false;
      if (!normalizedPoolId || normalizedPoolId === GACHA_ALL_POOL_TAG) return true;
      return pool.id === normalizedPoolId;
    });
    const exportData = {
      kind: GACHA_CATALOG_EXPORT_KIND,
      version: GACHA_CATALOG_VERSION,
      exportedAt: Date.now(),
      pools: pools.map(deps.serializeGachaPoolDefinitionForExport),
      items: items.map(deps.serializeGachaCatalogItemForExport),
    };
    return JSON.stringify(exportData, null, 2);
  };
  return exportGachaCatalogJson;
}
