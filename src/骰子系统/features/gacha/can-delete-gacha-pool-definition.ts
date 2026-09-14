// @ts-nocheck
/**
 * can-delete-gacha-pool-definition.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { GACHA_ALL_POOL_TAG } from './gacha-helpers';
import type { GachaPoolDefinition } from '../../entities/gacha-items';
export function createCanDeleteGachaPoolDefinition(deps: any) {
  const canDeleteGachaPoolDefinition = (pool: GachaPoolDefinition): boolean => {
    if (pool.id === GACHA_ALL_POOL_TAG) return false;
    return !pool.builtin;
  };
  return canDeleteGachaPoolDefinition;
}
