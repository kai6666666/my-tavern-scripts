// @ts-nocheck
/**
 * get-gacha-active-pool-tag.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { GACHA_ALL_POOL_TAG } from './gacha-helpers';
import type { GachaPoolTag } from '../../entities/gacha-items';
import type { GachaState } from './gacha-types';
export function createGetGachaActivePoolTag(deps: any) {
  const getGachaActivePoolTag = (state?: Pick<GachaState, 'activePoolTag'> | null): GachaPoolTag => {
    const stored = deps.getStoredGachaActivePoolTag(state?.activePoolTag || GACHA_ALL_POOL_TAG);
    const visibleIds = new Set(deps.getVisibleGachaPoolConfigDefinitions().map(pool => pool.id));
    return visibleIds.has(stored) ? stored : GACHA_ALL_POOL_TAG;
  };
  return getGachaActivePoolTag;
}
