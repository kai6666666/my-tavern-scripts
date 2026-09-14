// @ts-nocheck
/**
 * push-recent-gacha-reward.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { GACHA_RECENT_REWARD_LIMIT } from '../../entities/gacha-items';
import type { GachaState, GachaDrawOutcome, GachaRecentRewardRecord } from './gacha-types';
import type { GachaPoolTag } from '../../entities/gacha-items';
export function createPushRecentGachaReward(deps: any) {
  const pushRecentGachaReward = (state: GachaState, outcome: GachaDrawOutcome, poolTag: GachaPoolTag) => {
    const record: GachaRecentRewardRecord = {
      itemId: outcome.item.id,
      name: outcome.item.name,
      quality: outcome.item.quality,
      quantity: Math.max(1, outcome.quantity),
      duplicateConverted: outcome.duplicateConverted === true,
      shardGain: Math.max(0, outcome.shardGain || 0),
      poolTag,
      rewardTarget: outcome.item.rewardTarget,
      createdAt: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
    };
    state.recentRewards.unshift(record);
    state.recentRewards = state.recentRewards.slice(0, GACHA_RECENT_REWARD_LIMIT);
  };
  return pushRecentGachaReward;
}
