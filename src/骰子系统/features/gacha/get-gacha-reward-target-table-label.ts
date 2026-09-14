// @ts-nocheck
/**
 * get-gacha-reward-target-table-label.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaRewardTarget } from '../../entities/gacha-items';
export function createGetGachaRewardTargetTableLabel(deps: any) {
  const getGachaRewardTargetTableLabel = (target: GachaRewardTarget): string =>
    target === 'equipment' ? '装备表' : '物品表';
  return getGachaRewardTargetTableLabel;
}
