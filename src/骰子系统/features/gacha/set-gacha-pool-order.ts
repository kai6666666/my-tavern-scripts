// @ts-nocheck
/**
 * set-gacha-pool-order.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaPoolTag } from '../../entities/gacha-items';
export function createSetGachaPoolOrder(deps: any) {
  const setGachaPoolOrder = (poolId: GachaPoolTag, order: number): boolean =>
    deps.updateGachaPoolConfig(poolId, { order: Math.max(1, Math.floor(Number(order) || 0)) });

  const normalizeGachaItemEnabled = (value: unknown): boolean => value !== false;
  return setGachaPoolOrder;
}
