// @ts-nocheck
/**
 * is-advanced-preset-record.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createIsAdvancedPresetRecord(deps: any) {
  const isAdvancedPresetRecord = (value: unknown): value is Record<string, unknown> =>
    Boolean(value) && typeof value === 'object' && !Array.isArray(value);
  return isAdvancedPresetRecord;
}
