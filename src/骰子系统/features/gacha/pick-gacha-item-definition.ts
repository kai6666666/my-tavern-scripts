// @ts-nocheck
/**
 * pick-gacha-item-definition.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { GACHA_PICKUP_WEIGHT_MULTIPLIER } from './gacha-helpers';
import type { GachaItemDefinition, GachaPoolTag, GachaRarity, GachaRewardTarget } from '../../entities/gacha-items';
export function createPickGachaItemDefinition(deps: any) {
  const pickGachaItemDefinition = (
    poolTag: GachaPoolTag,
    rarity: GachaRarity,
    rewardTarget?: GachaRewardTarget,
    rawData = deps.getRuntimeGachaRawData(),
    availableTargets?: ReadonlySet<GachaRewardTarget>,
  ): GachaItemDefinition | null => {
    const candidates = deps.getGachaPoolDefinitions(poolTag, rawData).filter(item => {
      if (item.quality !== rarity) return false;
      if (rewardTarget && item.rewardTarget !== rewardTarget) return false;
      if (availableTargets && !availableTargets.has(item.rewardTarget)) return false;
      return true;
    });
    return deps.pickWeightedValue(
      candidates.map(item => ({
        value: item,
        weight:
          (Number(item.weight || 0) > 0 ? Number(item.weight || 0) : 1) *
          (deps.isGachaPickupItem(poolTag, item) ? GACHA_PICKUP_WEIGHT_MULTIPLIER : 1),
      })),
    );
  };
  return pickGachaItemDefinition;
}
