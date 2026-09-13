// @ts-nocheck
/**
 * get-gacha-catalog-items-for-export.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { GACHA_ALL_POOL_TAG, normalizeGachaPoolId } from './gacha-helpers';
import type { GachaItemDefinition, GachaPoolTag } from '../../entities/gacha-items';
export function createGetGachaCatalogItemsForExport(deps: any) {
  const getGachaCatalogItemsForExport = (rawData, poolId?: GachaPoolTag): GachaItemDefinition[] => {
    const normalizedPoolId = normalizeGachaPoolId(poolId);
    const allItems = deps.getAllGachaItemDefinitions(rawData);
    if (!normalizedPoolId) {
      const customIds = new Set(deps.getCustomGachaItemDefinitions(rawData).map(item => item.id));
      return allItems.filter(item => customIds.has(item.id));
    }
    const activeTags =
      normalizedPoolId === GACHA_ALL_POOL_TAG ? deps.getGachaAllExpandablePoolTags(rawData) : [normalizedPoolId];
    return allItems.filter(item => item.poolTags.some(tag => activeTags.includes(tag)));
  };
  return getGachaCatalogItemsForExport;
}
