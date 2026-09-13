// @ts-nocheck
/**
 * is-gacha-pool-enabled.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { GACHA_ALL_POOL_TAG } from './gacha-helpers';
import type { GachaPoolDefinition } from '../../entities/gacha-items';
export function createIsGachaPoolEnabled(deps: any) {
  const isGachaPoolEnabled = (pool: GachaPoolDefinition): boolean =>
    pool.id === GACHA_ALL_POOL_TAG || pool.includeInAll === true;
  return isGachaPoolEnabled;
}
