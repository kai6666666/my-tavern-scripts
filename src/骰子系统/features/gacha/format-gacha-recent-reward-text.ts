// @ts-nocheck
/**
 * format-gacha-recent-reward-text.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaRecentRewardRecord } from './gacha-types';
export function createFormatGachaRecentRewardText(deps: any) {
  const formatGachaRecentRewardText = (reward: GachaRecentRewardRecord): string => {
    if (reward.duplicateConverted) {
      return `${reward.name} → ${reward.shardGain}${deps.getGachaShardLabel(reward.quality)}`;
    }
    return `${reward.name} ×${reward.quantity}`;
  };
  return formatGachaRecentRewardText;
}
