// @ts-nocheck
/**
 * is-builtin-gacha-pool-id.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { BUILTIN_GACHA_POOL_DEFINITIONS } from '../../entities/gacha-items';
import type { GachaPoolTag } from '../../entities/gacha-items';
export function createIsBuiltinGachaPoolId(deps: any) {
  const isBuiltinGachaPoolId = (poolId: GachaPoolTag): boolean =>
    BUILTIN_GACHA_POOL_DEFINITIONS.some(pool => pool.id === poolId);
  return isBuiltinGachaPoolId;
}
