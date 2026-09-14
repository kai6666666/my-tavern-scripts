// @ts-nocheck
/**
 * add-gacha-shards.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaRarity } from '../../entities/gacha-items';
import type { GachaState } from './gacha-types';
export function createAddGachaShards(deps: any) {
  const addGachaShards = (state: GachaState, rarity: GachaRarity, amount: number) => {
    const safeAmount = Math.max(0, Math.floor(Number(amount) || 0));
    if (safeAmount <= 0) return 0;
    state.wallet.shards[rarity] = Math.max(0, Math.floor(Number(state.wallet.shards[rarity] || 0))) + safeAmount;
    return safeAmount;
  };
  return addGachaShards;
}
