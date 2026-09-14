// @ts-nocheck
/**
 * normalize-gacha-reward-target.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaRewardTarget } from '../../entities/gacha-items';
export function createNormalizeGachaRewardTarget(deps: any) {
  const normalizeGachaRewardTarget = (value: unknown): GachaRewardTarget =>
    value === 'equipment' ? 'equipment' : 'inventory';
  return normalizeGachaRewardTarget;
}
