// @ts-nocheck
/**
 * save-gacha-pool-settings.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { GACHA_ALL_POOL_TAG } from './gacha-helpers';
import { STORAGE_KEY_GACHA_POOL_SETTINGS } from '../../shared/storage-keys';
import { Store } from '../../shared/storage/store';
import type { GachaPoolDefinition } from '../../entities/gacha-items';
import type { GachaPoolSettingsRecord } from '../../features/gacha/gacha-types';
export function createSaveGachaPoolSettings(deps: any) {
  const saveGachaPoolSettings = (pools: readonly GachaPoolDefinition[]) => {
    const normalized = deps.cloneGachaPoolDefinitions(pools).map(pool => {
      const enabled = pool.id !== GACHA_ALL_POOL_TAG && pool.includeInAll === true;
      return {
        ...pool,
        visibleInTabs: pool.id === GACHA_ALL_POOL_TAG ? true : enabled,
        includeInAll: enabled,
      };
    });
    const saved = Store.set(STORAGE_KEY_GACHA_POOL_SETTINGS, {
      version: 1,
      pools: normalized,
      updatedAt: Date.now(),
    } satisfies GachaPoolSettingsRecord);
    if (!saved) throw new Error('卡池设置保存失败');
  };
  return saveGachaPoolSettings;
}
