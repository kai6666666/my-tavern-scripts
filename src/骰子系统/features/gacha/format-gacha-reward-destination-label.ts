// @ts-nocheck
/**
 * format-gacha-reward-destination-label.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaItemDefinition } from '../../entities/gacha-items';
export function createFormatGachaRewardDestinationLabel(deps: any) {
  const formatGachaRewardDestinationLabel = (
    rawData,
    item: Pick<GachaItemDefinition, 'rewardTarget' | 'targetTable' | 'targetColumns'>,
  ): string => {
    const fallback = deps.normalizeGachaTargetTable(item.targetTable) || deps.getGachaRewardTargetTableLabel(item.rewardTarget);
    try {
      const parsed = deps.getGachaRewardParseResult(rawData, item.rewardTarget, deps.getGachaRewardTargetOptions(item));
      return parsed.tableName || fallback;
    } catch {
      return fallback;
    }
  };
  return formatGachaRewardDestinationLabel;
}
