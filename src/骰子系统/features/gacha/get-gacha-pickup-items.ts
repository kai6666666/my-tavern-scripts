// @ts-nocheck
/**
 * get-gacha-pickup-items.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { GACHA_PICKUP_FALLBACK_LIMIT, GACHA_PICKUP_RARITIES } from './gacha-helpers';
import type { GachaItemDefinition, GachaPoolTag } from '../../entities/gacha-items';
export function createGetGachaPickupItems(deps: any) {
  const getGachaPickupItems = (poolTag: GachaPoolTag): GachaItemDefinition[] => {
    const cacheKey = `${deps.getGachaPickupRotationKey()}|${poolTag}`;
    if (deps.getGachaPickupItemsCache() && deps.getGachaPickupItemsCache().key === cacheKey) return deps.getGachaPickupItemsCache().items;

    const definitions = deps.getGachaPoolDefinitions(poolTag);
    const pickupItems = GACHA_PICKUP_RARITIES.map(rarity => {
      const candidates = definitions.filter(item => item.quality === rarity).sort((a, b) => a.id.localeCompare(b.id));
      if (candidates.length === 0) return null;
      const seed = `${deps.getGachaPickupRotationKey()}|${poolTag}|${rarity}`;
      return candidates[deps.hashGachaSeed(seed) % candidates.length];
    }).filter((item): item is GachaItemDefinition => Boolean(item));
    const items =
      pickupItems.length > 0
        ? pickupItems
        : [...definitions]
            .sort((a, b) => deps.getGachaRarityRank(b.quality) - deps.getGachaRarityRank(a.quality) || a.id.localeCompare(b.id))
            .slice(0, GACHA_PICKUP_FALLBACK_LIMIT);
    deps.setGachaPickupItemsCache({ key: cacheKey, items });
    return items;
  };
  return getGachaPickupItems;
}
