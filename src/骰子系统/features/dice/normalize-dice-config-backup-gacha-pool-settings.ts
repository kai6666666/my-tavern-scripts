// @ts-nocheck
/**
 * normalize-dice-config-backup-gacha-pool-settings.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaPoolDefinition } from '../../entities/gacha-items';
import type { GachaPoolSettingsRecord } from '../../features/gacha/gacha-types';
export function createNormalizeDiceConfigBackupGachaPoolSettings(deps: any) {
  const normalizeDiceConfigBackupGachaPoolSettings = (value: unknown): GachaPoolSettingsRecord | null => {
    if (!deps.isDiceConfigBackupRecord(value)) return null;
    const pools = Array.isArray(value.pools)
      ? value.pools.map(deps.normalizeGachaPoolDefinition).filter((pool): pool is GachaPoolDefinition => Boolean(pool))
      : [];
    return {
      version: Number(value.version) || 1,
      pools,
      updatedAt: Math.max(0, Number(value.updatedAt) || 0),
    };
  };
  return normalizeDiceConfigBackupGachaPoolSettings;
}
