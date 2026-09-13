// @ts-nocheck
/**
 * pick-gacha-rarity.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { GACHA_RARITY_ORDER, GACHA_RARITY_WEIGHTS } from '../../entities/gacha-items';
import type { GachaPoolTag, GachaRarity, GachaRewardTarget } from '../../entities/gacha-items';
export function createPickGachaRarity(deps: any) {
  const pickGachaRarity = (
    poolTag: GachaPoolTag,
    minimumRarity: GachaRarity | null,
    rawData = deps.getRuntimeGachaRawData(),
    availableTargets?: ReadonlySet<GachaRewardTarget>,
  ): GachaRarity | null => {
    const availableItems = deps.getGachaPoolDefinitions(poolTag, rawData).filter(
      item => !availableTargets || availableTargets.has(item.rewardTarget),
    );
    if (availableItems.length === 0) return null;
    const minimumRank = minimumRarity ? deps.getGachaRarityRank(minimumRarity) : -1;
    const rarityCandidates = GACHA_RARITY_ORDER.filter(rarity => {
      if (minimumRank >= 0 && deps.getGachaRarityRank(rarity) < minimumRank) return false;
      return availableItems.some(item => item.quality === rarity);
    });
    const fallbackCandidates =
      rarityCandidates.length > 0
        ? rarityCandidates
        : GACHA_RARITY_ORDER.filter(rarity => availableItems.some(item => item.quality === rarity));
    if (fallbackCandidates.length === 0) return null;
    return deps.pickWeightedValue(
      fallbackCandidates.map(rarity => ({
        value: rarity,
        weight: Number(GACHA_RARITY_WEIGHTS[rarity] || 0),
      })),
    );
  };
  return pickGachaRarity;
}
