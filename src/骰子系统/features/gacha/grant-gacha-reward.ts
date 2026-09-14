// @ts-nocheck
/**
 * grant-gacha-reward.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaState, GachaDrawOutcome } from './gacha-types';
import type { GachaItemDefinition } from '../../entities/gacha-items';
export function createGrantGachaReward(deps: any) {
  const grantGachaReward = (
    rawData,
    state: GachaState,
    item: GachaItemDefinition,
    quantity: number,
    snapshots?: Map<string, unknown>,
  ): { outcome: GachaDrawOutcome; modifiedSheetKey?: string } | null =>
    item.rewardTarget === 'equipment'
      ? deps.grantEquipmentGachaReward(rawData, state, item, quantity, snapshots)
      : deps.grantInventoryGachaReward(rawData, state, item, quantity, snapshots);
  return grantGachaReward;
}
