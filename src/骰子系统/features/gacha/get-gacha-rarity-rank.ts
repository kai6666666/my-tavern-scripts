// @ts-nocheck
/**
 * get-gacha-rarity-rank.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { GACHA_RARITY_ORDER } from '../../entities/gacha-items';
import type { GachaRarity } from '../../entities/gacha-items';
export function createGetGachaRarityRank(deps: any) {
  const getGachaRarityRank = (rarity: GachaRarity): number => {
    const index = GACHA_RARITY_ORDER.indexOf(rarity);
    return index >= 0 ? index : 0;
  };
  return getGachaRarityRank;
}
