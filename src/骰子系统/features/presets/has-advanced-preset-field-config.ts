// @ts-nocheck
/**
 * has-advanced-preset-field-config.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createHasAdvancedPresetFieldConfig(deps: any) {
  const hasAdvancedPresetFieldConfig = (value: unknown): value is Record<string, unknown> =>
    deps.isAdvancedPresetRecord(value) && Object.keys(value).length > 0;

  const parseAdvancedPresetJsonCandidate = (candidate: string): unknown => parseJsoncValue(candidate);
  return hasAdvancedPresetFieldConfig;
}
