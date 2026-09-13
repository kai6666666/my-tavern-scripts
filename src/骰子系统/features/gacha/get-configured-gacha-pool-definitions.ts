// @ts-nocheck
/**
 * get-configured-gacha-pool-definitions.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { BUILTIN_GACHA_POOL_DEFINITIONS } from '../../entities/gacha-items';
import { GACHA_ALL_POOL_TAG } from './gacha-helpers';
import type { GachaPoolDefinition, GachaPoolTag } from '../../entities/gacha-items';
export function createGetConfiguredGachaPoolDefinitions(deps: any) {
  const getConfiguredGachaPoolDefinitions = (): GachaPoolDefinition[] => {
    const byId = new Map<GachaPoolTag, GachaPoolDefinition>();
    BUILTIN_GACHA_POOL_DEFINITIONS.forEach(pool => byId.set(pool.id, { ...pool }));
    deps.getStoredGachaPoolSettings().pools.forEach(pool => {
      const existing = byId.get(pool.id);
      const enabled = pool.id !== GACHA_ALL_POOL_TAG && pool.includeInAll === true;
      byId.set(pool.id, {
        ...deps.buildDefaultGachaPoolDefinition(pool.id, existing || pool),
        ...existing,
        ...pool,
        builtin: existing?.builtin === true,
        visibleInTabs: pool.id === GACHA_ALL_POOL_TAG ? true : enabled,
        includeInAll: enabled,
      });
    });
    if (!byId.has(GACHA_ALL_POOL_TAG)) {
      byId.set(GACHA_ALL_POOL_TAG, deps.buildDefaultGachaPoolDefinition(GACHA_ALL_POOL_TAG, { builtin: true, order: 0 }));
    }
    return deps.sortGachaPoolDefinitions(Array.from(byId.values()));
  };
  return getConfiguredGachaPoolDefinitions;
}
