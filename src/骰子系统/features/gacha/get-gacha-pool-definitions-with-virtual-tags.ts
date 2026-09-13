// @ts-nocheck
/**
 * get-gacha-pool-definitions-with-virtual-tags.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { GACHA_ALL_POOL_TAG, normalizeGachaPoolId } from '../../features/gacha/gacha-helpers';
import type { GachaPoolDefinition, GachaPoolTag } from '../../entities/gacha-items';
export function createGetGachaPoolDefinitionsWithVirtualTags(deps: any) {
  const getGachaPoolDefinitionsWithVirtualTags = (
    tags: readonly GachaPoolTag[],
    basePools: readonly GachaPoolDefinition[] = deps.getConfiguredGachaPoolDefinitions(),
  ): GachaPoolDefinition[] => {
    const pools = deps.cloneGachaPoolDefinitions(basePools);
    const known = new Set(pools.map(pool => pool.id));
    let nextOrder = pools.reduce((max, pool) => Math.max(max, Number(pool.order) || 0), 0) + 10;
    tags.forEach(rawTag => {
      const id = normalizeGachaPoolId(rawTag);
      if (!id || id === GACHA_ALL_POOL_TAG || known.has(id)) return;
      pools.push(
        deps.buildDefaultGachaPoolDefinition(id, {
          name: id,
          builtin: false,
          visibleInTabs: true,
          includeInAll: true,
          order: nextOrder,
        }),
      );
      known.add(id);
      nextOrder += 10;
    });
    return deps.sortGachaPoolDefinitions(pools);
  };
  return getGachaPoolDefinitionsWithVirtualTags;
}
