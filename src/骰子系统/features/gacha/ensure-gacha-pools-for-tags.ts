// @ts-nocheck
/**
 * ensure-gacha-pools-for-tags.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaPoolDefinition, GachaPoolTag } from '../../entities/gacha-items';
export function createEnsureGachaPoolsForTags(deps: any) {
  const ensureGachaPoolsForTags = (tags: readonly GachaPoolTag[]): GachaPoolDefinition[] => {
    const pools = deps.getConfiguredGachaPoolDefinitions();
    const nextPools = deps.getGachaPoolDefinitionsWithVirtualTags(tags, pools);
    if (nextPools.length !== pools.length) deps.saveGachaPoolSettings(nextPools);
    return deps.getConfiguredGachaPoolDefinitions();
  };
  return ensureGachaPoolsForTags;
}
