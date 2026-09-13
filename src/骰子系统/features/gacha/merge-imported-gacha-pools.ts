// @ts-nocheck
/**
 * merge-imported-gacha-pools.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { GACHA_ALL_POOL_TAG } from './gacha-helpers';
import type { GachaPoolDefinition } from '../../entities/gacha-items';
export function createMergeImportedGachaPools(deps: any) {
  const mergeImportedGachaPools = (pools: readonly GachaPoolDefinition[]) => {
    if (!pools.length) return;
    const current = deps.getConfiguredGachaPoolDefinitions();
    const byId = new Map(current.map(pool => [pool.id, pool]));
    pools.forEach(pool => {
      if (!pool.id || pool.id === GACHA_ALL_POOL_TAG) return;
      const existing = byId.get(pool.id);
      const enabled = pool.includeInAll === true;
      byId.set(pool.id, {
        ...(existing || deps.buildDefaultGachaPoolDefinition(pool.id, pool)),
        name: pool.name || existing?.name || pool.id,
        builtin: existing?.builtin === true,
        visibleInTabs: enabled,
        includeInAll: enabled,
        order: Number.isFinite(Number(pool.order)) ? Number(pool.order) : (existing?.order ?? 999),
      });
    });
    deps.saveGachaPoolSettings(Array.from(byId.values()));
  };
  return mergeImportedGachaPools;
}
