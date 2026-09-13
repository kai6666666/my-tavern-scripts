// @ts-nocheck
/**
 * draw-single-gacha-outcome.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaDrawOutcome, GachaState } from './gacha-types';
import type { GachaRewardTarget } from '../../entities/gacha-items';
export function createDrawSingleGachaOutcome(deps: any) {
  const drawSingleGachaOutcome = (
    rawData,
    state: GachaState,
    availableTargets: ReadonlySet<GachaRewardTarget> = deps.getAvailableGachaRewardTargets(rawData),
    snapshots?: Map<string, unknown>,
  ): { outcome: GachaDrawOutcome; modifiedSheetKey?: string } | null => {
    const poolTag = state.activePoolTag;
    const minimumRarity = deps.getGachaMinimumRarity(state);
    const rarity = deps.pickGachaRarity(poolTag, minimumRarity, rawData, availableTargets);
    if (!rarity) return null;
    const item = deps.pickGachaItemDefinition(poolTag, rarity, undefined, rawData, availableTargets);
    if (!item) return null;
    const result = deps.grantGachaReward(rawData, state, item, deps.getGachaItemGrantQuantity(item), snapshots);
    if (!result) return null;
    deps.applyGachaPityAfterDraw(state, item.quality);
    deps.pushRecentGachaReward(state, result.outcome, poolTag);
    return result;
  };
  return drawSingleGachaOutcome;
}
