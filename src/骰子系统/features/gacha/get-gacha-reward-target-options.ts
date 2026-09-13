// @ts-nocheck
/**
 * get-gacha-reward-target-options.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaItemDefinition } from '../../entities/gacha-items';
export function createGetGachaRewardTargetOptions(deps: any) {
  const getGachaRewardTargetOptions = (
    item: Pick<GachaItemDefinition, 'targetTable' | 'targetColumns'>,
  ): GachaRewardParseOptions => ({
    targetTable: deps.normalizeGachaTargetTable(item.targetTable),
    targetColumns: deps.normalizeGachaTargetColumns(item.targetColumns),
  });
  return getGachaRewardTargetOptions;
}
