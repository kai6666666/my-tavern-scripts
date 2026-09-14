// @ts-nocheck
/**
 * normalize-recent-gacha-rewards.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaRecentRewardRecord } from './gacha-types';
export function createNormalizeRecentGachaRewards(deps: any) {
  const normalizeRecentGachaRewards = (rawValue: unknown): GachaRecentRewardRecord[] => deps.getGachaStateCore().normalizeRecentRewards(rawValue);
  return normalizeRecentGachaRewards;
}
