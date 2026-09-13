// @ts-nocheck
/**
 * get-gacha-all-expandable-pool-tags.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { GACHA_ALL_POOL_TAG } from './gacha-helpers';
import type { GachaPoolTag } from '../../entities/gacha-items';
export function createGetGachaAllExpandablePoolTags(deps: any) {
  const getGachaAllExpandablePoolTags = (rawData = deps.getRuntimeGachaRawData()): GachaPoolTag[] => {
    return deps.getAllGachaPoolConfigDefinitions(rawData)
      .filter(pool => pool.id !== GACHA_ALL_POOL_TAG && deps.isGachaPoolEnabled(pool))
      .map(pool => pool.id);
  };
  return getGachaAllExpandablePoolTags;
}
