// @ts-nocheck
/**
 * get-gacha-reward-parse-result.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaRewardTarget } from '../../entities/gacha-items';
export function createGetGachaRewardParseResult(deps: any) {
  const getGachaRewardParseResult = (
    rawData,
    target: GachaRewardTarget,
    options: GachaRewardParseOptions = {},
  ): GachaRewardParseResult => (target === 'equipment' ? deps.parseEquipmentItems(rawData, options) : deps.parseInventoryItems(rawData, options));
  return getGachaRewardParseResult;
}
