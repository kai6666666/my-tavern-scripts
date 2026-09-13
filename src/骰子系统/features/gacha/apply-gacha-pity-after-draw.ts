// @ts-nocheck
/**
 * apply-gacha-pity-after-draw.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaRarity } from '../../entities/gacha-items';
import type { GachaState } from './gacha-types';
export function createApplyGachaPityAfterDraw(deps: any) {
  const applyGachaPityAfterDraw = (state: GachaState, rarity: GachaRarity) => {
    state.totalDraws += 1;
    state.pity.rare = deps.getGachaRarityRank(rarity) >= deps.getGachaRarityRank('稀有') ? 0 : state.pity.rare + 1;
    state.pity.legend = deps.getGachaRarityRank(rarity) >= deps.getGachaRarityRank('传说') ? 0 : state.pity.legend + 1;
  };
  return applyGachaPityAfterDraw;
}
