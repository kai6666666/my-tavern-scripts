// @ts-nocheck
/**
 * sort-gacha-pool-definitions.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { GACHA_ALL_POOL_TAG } from './gacha-helpers';
import type { GachaPoolDefinition } from '../../entities/gacha-items';
export function createSortGachaPoolDefinitions(deps: any) {
  const sortGachaPoolDefinitions = (pools: GachaPoolDefinition[]): GachaPoolDefinition[] =>
    pools.sort((a, b) => {
      if (a.id === GACHA_ALL_POOL_TAG) return -1;
      if (b.id === GACHA_ALL_POOL_TAG) return 1;
      return (a.order ?? 999) - (b.order ?? 999) || a.name.localeCompare(b.name, 'zh-Hans-CN');
    });
  return sortGachaPoolDefinitions;
}
