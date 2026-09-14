// @ts-nocheck
/**
 * get-stored-gacha-active-pool-tag.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { Store } from '../../shared/storage/store';
import { STORAGE_KEY_GACHA_ACTIVE_POOL_TAG } from '../../shared/storage-keys';
import { normalizeGachaPoolId } from './gacha-helpers';
import type { GachaPoolTag } from '../../entities/gacha-items';
export function createGetStoredGachaActivePoolTag(deps: any) {
  const getStoredGachaActivePoolTag = (fallback: GachaPoolTag): GachaPoolTag => {
    const stored = normalizeGachaPoolId(Store.get(STORAGE_KEY_GACHA_ACTIVE_POOL_TAG, fallback) || fallback);
    return deps.getConfiguredGachaPoolDefinitions().some(pool => pool.id === stored) ? stored : fallback;
  };
  return getStoredGachaActivePoolTag;
}
