// @ts-nocheck
/**
 * normalize-gacha-target-table.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createNormalizeGachaTargetTable(deps: any) {
  const normalizeGachaTargetTable = (raw: unknown): string | undefined => {
    if (typeof raw !== 'string') return undefined;
    const value = deps.truncateGachaText(raw.trim(), deps.getGACHA_TARGET_TABLE_MAX_LENGTH());
    return value || undefined;
  };
  return normalizeGachaTargetTable;
}
