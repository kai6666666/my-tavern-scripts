// @ts-nocheck
/**
 * merge-dice-config-backup-gacha-pool-settings.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { GACHA_ALL_POOL_TAG } from '../../features/gacha/gacha-helpers';
import type { GachaPoolSettingsRecord } from '../../features/gacha/gacha-types';
export function createMergeDiceConfigBackupGachaPoolSettings(deps: any) {
  const mergeDiceConfigBackupGachaPoolSettings = (
    current: unknown,
    incoming: unknown,
  ): GachaPoolSettingsRecord | null => {
    const incomingRecord = deps.normalizeDiceConfigBackupGachaPoolSettings(incoming);
    if (!incomingRecord) return null;
    const currentRecord = deps.normalizeDiceConfigBackupGachaPoolSettings(current) || {
      version: 1,
      pools: [],
      updatedAt: 0,
    };
    const currentById = new Map(currentRecord.pools.map(pool => [pool.id, pool]));
    const incomingIds = new Set(incomingRecord.pools.map(pool => pool.id));
    const mergedPools = incomingRecord.pools.map(pool => {
      const existing = currentById.get(pool.id);
      const enabled = pool.id !== GACHA_ALL_POOL_TAG && pool.includeInAll === true;
      return {
        ...(existing || deps.buildDefaultGachaPoolDefinition(pool.id, pool)),
        ...pool,
        builtin: existing?.builtin === true || deps.isBuiltinGachaPoolId(pool.id),
        visibleInTabs: pool.id === GACHA_ALL_POOL_TAG ? true : enabled,
        includeInAll: enabled,
      };
    });
    currentRecord.pools.forEach(pool => {
      if (!incomingIds.has(pool.id)) mergedPools.push(pool);
    });
    return {
      version: Math.max(1, incomingRecord.version, currentRecord.version),
      pools: mergedPools,
      updatedAt: Date.now(),
    };
  };
  return mergeDiceConfigBackupGachaPoolSettings;
}
