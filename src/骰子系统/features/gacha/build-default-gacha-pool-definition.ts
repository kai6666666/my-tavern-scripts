// @ts-nocheck
/**
 * build-default-gacha-pool-definition.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { GACHA_ALL_POOL_TAG } from './gacha-helpers';
import type { GachaPoolDefinition, GachaPoolTag } from '../../entities/gacha-items';
export function createBuildDefaultGachaPoolDefinition(deps: any) {
  const buildDefaultGachaPoolDefinition = (
    id: GachaPoolTag,
    options: Partial<Omit<GachaPoolDefinition, 'id'>> = {},
  ): GachaPoolDefinition => {
    const enabled = id !== GACHA_ALL_POOL_TAG && options.includeInAll === true;
    return {
      id,
      name: options.name || id,
      builtin: options.builtin === true,
      visibleInTabs: id === GACHA_ALL_POOL_TAG || enabled,
      includeInAll: enabled,
      order: Number.isFinite(Number(options.order)) ? Number(options.order) : 999,
    };
  };
  return buildDefaultGachaPoolDefinition;
}
