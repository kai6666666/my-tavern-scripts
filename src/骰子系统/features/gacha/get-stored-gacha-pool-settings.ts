// @ts-nocheck
/**
 * get-stored-gacha-pool-settings.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { Store } from '../../shared/storage/store';
import { STORAGE_KEY_GACHA_POOL_SETTINGS } from '../../shared/storage-keys';
import type { GachaPoolDefinition } from '../../entities/gacha-items';
import type { GachaPoolSettingsRecord } from './gacha-types';
export function createGetStoredGachaPoolSettings(deps: any) {
  const getStoredGachaPoolSettings = (): GachaPoolSettingsRecord => {
    const stored = Store.get(STORAGE_KEY_GACHA_POOL_SETTINGS, null);
    const record = stored && typeof stored === 'object' ? (stored as Record<string, unknown>) : {};
    const pools = Array.isArray(record.pools)
      ? record.pools.map(deps.normalizeGachaPoolDefinition).filter((pool): pool is GachaPoolDefinition => Boolean(pool))
      : [];
    return {
      version: Number(record.version) || 1,
      pools,
      updatedAt: Math.max(0, Number(record.updatedAt) || 0),
    };
  };
  return getStoredGachaPoolSettings;
}
