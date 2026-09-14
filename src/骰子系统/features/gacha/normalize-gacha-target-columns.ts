// @ts-nocheck
/**
 * normalize-gacha-target-columns.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaRewardTargetColumns } from '../../entities/gacha-items';
export function createNormalizeGachaTargetColumns(deps: any) {
  const normalizeGachaTargetColumns = (raw: unknown): GachaRewardTargetColumns | undefined => {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return undefined;
    const columns: GachaRewardTargetColumns = {};
    const record = raw as Record<string, unknown>;
    deps.getGACHA_TARGET_COLUMN_KEYS().forEach(key => {
      const value = record[key];
      if (typeof value !== 'string') return;
      const headerName = deps.truncateGachaText(value.trim(), deps.getGACHA_TARGET_COLUMN_VALUE_MAX_LENGTH());
      if (headerName) columns[key] = headerName;
    });
    return Object.keys(columns).length ? columns : undefined;
  };
  return normalizeGachaTargetColumns;
}
