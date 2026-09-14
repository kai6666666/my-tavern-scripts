// @ts-nocheck
/**
 * get-active-gacha-pool-tags.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { GACHA_ALL_POOL_TAG } from './gacha-helpers';
import type { GachaPoolTag } from '../../entities/gacha-items';
export function createGetActiveGachaPoolTags(deps: any) {
  const getActiveGachaPoolTags = (poolTag: GachaPoolTag): GachaPoolTag[] => {
    if (poolTag === GACHA_ALL_POOL_TAG) return deps.getGachaAllExpandablePoolTags();
    return [poolTag];
  };
  return getActiveGachaPoolTags;
}
