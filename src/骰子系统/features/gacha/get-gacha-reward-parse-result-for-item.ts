// @ts-nocheck
/**
 * get-gacha-reward-parse-result-for-item.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaItemDefinition } from '../../entities/gacha-items';
export function createGetGachaRewardParseResultForItem(deps: any) {
  const getGachaRewardParseResultForItem = (
    rawData,
    item: Pick<GachaItemDefinition, 'rewardTarget' | 'targetTable' | 'targetColumns'>,
  ): GachaRewardParseResult =>
    deps.getGachaRewardParseResult(rawData, item.rewardTarget, { ...deps.getGachaRewardTargetOptions(item), requireNameColumn: true });
  return getGachaRewardParseResultForItem;
}
