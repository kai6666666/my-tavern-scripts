// @ts-nocheck
/**
 * get-gacha-minimum-rarity.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { GACHA_LEGEND_PITY_THRESHOLD, GACHA_RARE_PITY_THRESHOLD } from '../../entities/gacha-items';
import type { GachaRarity } from '../../entities/gacha-items';
import type { GachaState } from './gacha-types';
export function createGetGachaMinimumRarity(deps: any) {
  const getGachaMinimumRarity = (state: GachaState): GachaRarity | null => {
    if (state.pity.legend >= GACHA_LEGEND_PITY_THRESHOLD) return '传说';
    if (state.pity.rare >= GACHA_RARE_PITY_THRESHOLD) return '稀有';
    return null;
  };
  return getGachaMinimumRarity;
}
