// @ts-nocheck
/**
 * save-stored-gacha-settings-pool-tag.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { Store } from '../../shared/storage/store';
import { STORAGE_KEY_GACHA_SETTINGS_POOL_TAG } from '../../shared/storage-keys';
import { normalizeGachaPoolId } from './gacha-helpers';
import type { GachaPoolTag } from '../../entities/gacha-items';
export function createSaveStoredGachaSettingsPoolTag(deps: any) {
  const saveStoredGachaSettingsPoolTag = (poolTag: GachaPoolTag) => {
    const normalizedPoolId = normalizeGachaPoolId(poolTag);
    if (!normalizedPoolId) return;
    if (!Store.set(STORAGE_KEY_GACHA_SETTINGS_POOL_TAG, normalizedPoolId)) throw new Error('商城设置页卡池保存失败');
  };
  return saveStoredGachaSettingsPoolTag;
}
