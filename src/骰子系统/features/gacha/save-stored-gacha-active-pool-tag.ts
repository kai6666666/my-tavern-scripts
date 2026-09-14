// @ts-nocheck
/**
 * save-stored-gacha-active-pool-tag.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { Store } from '../../shared/storage/store';
import { STORAGE_KEY_GACHA_ACTIVE_POOL_TAG } from '../../shared/storage-keys';
import type { GachaPoolTag } from '../../entities/gacha-items';
export function createSaveStoredGachaActivePoolTag(deps: any) {
  const saveStoredGachaActivePoolTag = (poolTag: GachaPoolTag) => {
    if (!Store.set(STORAGE_KEY_GACHA_ACTIVE_POOL_TAG, poolTag)) throw new Error('当前卡池保存失败');
  };
  return saveStoredGachaActivePoolTag;
}
