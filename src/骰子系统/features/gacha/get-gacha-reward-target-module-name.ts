// @ts-nocheck
/**
 * get-gacha-reward-target-module-name.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaRewardTarget } from '../../entities/gacha-items';
export function createGetGachaRewardTargetModuleName(deps: any) {
  const getGachaRewardTargetModuleName = (target: GachaRewardTarget): string =>
    target === 'equipment' ? '装备' : '物品';
  return getGachaRewardTargetModuleName;
}
