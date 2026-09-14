// @ts-nocheck
/**
 * get-total-gacha-shards.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { GACHA_RARITY_ORDER } from '../../entities/gacha-items';
import type { GachaState } from './gacha-types';
export function createGetTotalGachaShards(deps: any) {
  const getTotalGachaShards = (state: GachaState): number =>
    GACHA_RARITY_ORDER.reduce(
      (sum, rarity) => sum + Math.max(0, Math.floor(Number(state.wallet.shards[rarity] || 0))),
      0,
    );
  return getTotalGachaShards;
}
