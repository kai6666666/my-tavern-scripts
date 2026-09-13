// @ts-nocheck
/**
 * get-gacha-target-column-entries.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaRewardTargetColumnKey, GachaRewardTargetColumns } from '../../entities/gacha-items';
export function createGetGachaTargetColumnEntries(deps: any) {
  const getGachaTargetColumnEntries = (targetColumns?: GachaRewardTargetColumns): [GachaRewardTargetColumnKey, string][] =>
    deps.getGACHA_TARGET_COLUMN_KEYS().map(key => [key, String(targetColumns?.[key] || '').trim()] as [GachaRewardTargetColumnKey, string]).filter(
      ([, value]) => Boolean(value),
    );
  return getGachaTargetColumnEntries;
}
