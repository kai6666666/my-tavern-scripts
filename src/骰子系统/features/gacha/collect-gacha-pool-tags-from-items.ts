// @ts-nocheck
/**
 * collect-gacha-pool-tags-from-items.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { GACHA_ALL_POOL_TAG, normalizeGachaPoolId } from './gacha-helpers';
import { GACHA_POOL_TAGS } from '../../entities/gacha-items';
import type { GachaPoolTag } from '../../entities/gacha-items';
export function createCollectGachaPoolTagsFromItems(deps: any) {
  const collectGachaPoolTagsFromItems = (rawData = deps.getRuntimeGachaRawData()): GachaPoolTag[] => {
    const tags = new Set<GachaPoolTag>();
    try {
      deps.getAllGachaItemDefinitions(rawData).forEach(item => {
        (item.poolTags || []).forEach(tag => {
          const normalized = normalizeGachaPoolId(tag);
          if (normalized && normalized !== GACHA_ALL_POOL_TAG) tags.add(normalized);
        });
      });
    } catch {
      GACHA_POOL_TAGS.forEach(tag => {
        if (tag !== GACHA_ALL_POOL_TAG) tags.add(tag);
      });
    }
    return Array.from(tags);
  };
  return collectGachaPoolTagsFromItems;
}
