// @ts-nocheck
/**
 * gacha-target-column-keys.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaRewardTargetColumnKey } from '../../entities/gacha-items';
export function createGachaTargetColumnKeys(deps: any) {
  const GACHA_TARGET_COLUMN_KEYS: readonly GachaRewardTargetColumnKey[] = [
    'name',
    'type',
    'quantity',
    'quality',
    'tags',
    'effect',
    'description',
    'part',
    'status',
  ];
  return GACHA_TARGET_COLUMN_KEYS;
}
