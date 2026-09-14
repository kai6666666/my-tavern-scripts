// @ts-nocheck
/**
 * gacha-common-written-target-column-keys.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaRewardTargetColumnKey } from '../../entities/gacha-items';
export function createGachaCommonWrittenTargetColumnKeys(deps: any) {
  const GACHA_COMMON_WRITTEN_TARGET_COLUMN_KEYS = new Set<GachaRewardTargetColumnKey>([
    'name',
    'type',
    'quantity',
    'quality',
    'tags',
    'effect',
    'description',
  ]);
  return GACHA_COMMON_WRITTEN_TARGET_COLUMN_KEYS;
}
