// @ts-nocheck
/**
 * update-gacha-pool-config.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { GACHA_ALL_POOL_TAG, normalizeGachaPoolId, normalizeGachaPoolName } from './gacha-helpers';
import type { GachaPoolDefinition, GachaPoolTag } from '../../entities/gacha-items';
export function createUpdateGachaPoolConfig(deps: any) {
  const updateGachaPoolConfig = (poolId: GachaPoolTag, updates: Partial<GachaPoolDefinition>): boolean => {
    const id = normalizeGachaPoolId(poolId);
    if (!id) return false;
    const pools = deps.getConfiguredGachaPoolDefinitions();
    const index = pools.findIndex(pool => pool.id === id);
    if (index < 0) return false;
    const existing = pools[index];
    const enabledUpdate = updates.includeInAll ?? updates.visibleInTabs;
    const enabled = id !== GACHA_ALL_POOL_TAG && (enabledUpdate === undefined ? existing.includeInAll : enabledUpdate) === true;
    pools[index] = {
      ...existing,
      ...updates,
      id,
      builtin: existing.builtin,
      visibleInTabs: id === GACHA_ALL_POOL_TAG ? true : enabled,
      includeInAll: enabled,
      name: updates.name !== undefined ? normalizeGachaPoolName(updates.name, id) : existing.name,
    };
    deps.saveGachaPoolSettings(pools);
    return true;
  };
  return updateGachaPoolConfig;
}
