// @ts-nocheck
/**
 * gacha-equipment-written-target-column-keys.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaRewardTargetColumnKey } from '../../entities/gacha-items';
export function createGachaEquipmentWrittenTargetColumnKeys(deps: any) {
  const GACHA_EQUIPMENT_WRITTEN_TARGET_COLUMN_KEYS = new Set<GachaRewardTargetColumnKey>([
    ...deps.getGACHA_COMMON_WRITTEN_TARGET_COLUMN_KEYS(),
    'status',
  ]);
  return GACHA_EQUIPMENT_WRITTEN_TARGET_COLUMN_KEYS;
}
