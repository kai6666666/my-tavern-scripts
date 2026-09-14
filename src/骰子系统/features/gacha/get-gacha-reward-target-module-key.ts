// @ts-nocheck
/**
 * get-gacha-reward-target-module-key.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaRewardTarget } from '../../entities/gacha-items';
export function createGetGachaRewardTargetModuleKey(deps: any) {
  const getGachaRewardTargetModuleKey = (target: GachaRewardTarget): 'bag' | 'equip' =>
    target === 'equipment' ? 'equip' : 'bag';
  return getGachaRewardTargetModuleKey;
}
