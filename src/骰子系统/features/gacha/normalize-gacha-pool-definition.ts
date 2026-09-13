// @ts-nocheck
/**
 * normalize-gacha-pool-definition.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { GACHA_ALL_POOL_TAG, normalizeGachaPoolId, normalizeGachaPoolName } from './gacha-helpers';
import type { GachaPoolDefinition } from '../../entities/gacha-items';
export function createNormalizeGachaPoolDefinition(deps: any) {
  const normalizeGachaPoolDefinition = (rawPool: unknown): GachaPoolDefinition | null => {
    if (!rawPool || typeof rawPool !== 'object') return null;
    const record = rawPool as Record<string, unknown>;
    const id = normalizeGachaPoolId(record.id || record.tag || record.name);
    if (!id) return null;
    const builtin = deps.isBuiltinGachaPoolId(id);
    const allPool = id === GACHA_ALL_POOL_TAG;
    const enabled =
      !allPool &&
      (record.includeInAll === undefined
        ? record.visibleInTabs !== false && record.visible !== false
        : record.includeInAll === true);
    return {
      id,
      name: normalizeGachaPoolName(record.name || record.label || id, id),
      builtin,
      visibleInTabs: allPool || enabled,
      includeInAll: enabled,
      order: Number.isFinite(Number(record.order)) ? Number(record.order) : builtin ? 100 : 999,
    };
  };
  return normalizeGachaPoolDefinition;
}
