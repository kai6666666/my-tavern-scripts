// @ts-nocheck
/**
 * has-gacha-reward-table-for-item.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaItemDefinition } from '../../entities/gacha-items';
export function createHasGachaRewardTableForItem(deps: any) {
  const hasGachaRewardTableForItem = (
    rawData,
    item: Pick<GachaItemDefinition, 'rewardTarget' | 'targetTable' | 'targetColumns'>,
  ): boolean => {
    try {
      const parsed = deps.getGachaRewardParseResultForItem(rawData, item);
      return Boolean(parsed.tableKey && rawData?.[parsed.tableKey] && Array.isArray(rawData[parsed.tableKey]?.content));
    } catch {
      return false;
    }
  };
  return hasGachaRewardTableForItem;
}
