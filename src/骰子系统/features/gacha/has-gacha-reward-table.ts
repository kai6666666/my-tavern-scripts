// @ts-nocheck
/**
 * has-gacha-reward-table.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaRewardTarget } from '../../entities/gacha-items';
export function createHasGachaRewardTable(deps: any) {
  const hasGachaRewardTable = (rawData, target: GachaRewardTarget): boolean => {
    const parsed = deps.getGachaRewardParseResult(rawData, target);
    return Boolean(parsed.tableKey && rawData?.[parsed.tableKey] && Array.isArray(rawData[parsed.tableKey]?.content));
  };
  return hasGachaRewardTable;
}
