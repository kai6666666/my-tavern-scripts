// @ts-nocheck
/**
 * get-available-gacha-reward-targets.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { GACHA_REWARD_TARGETS } from '../../entities/gacha-items';
import type { GachaRewardTarget } from '../../entities/gacha-items';
export function createGetAvailableGachaRewardTargets(deps: any) {
  const getAvailableGachaRewardTargets = (rawData): Set<GachaRewardTarget> =>
    new Set(GACHA_REWARD_TARGETS.filter(target => deps.hasGachaRewardTable(rawData, target)));
  return getAvailableGachaRewardTargets;
}
