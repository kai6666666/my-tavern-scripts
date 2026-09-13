// @ts-nocheck
/**
 * clone-advanced-preset-field-with-defaults.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createCloneAdvancedPresetFieldWithDefaults(deps: any) {
  const cloneAdvancedPresetFieldWithDefaults = (
    rawField: unknown,
    fallback: Record<string, unknown>,
  ): Record<string, unknown> => {
    const field = deps.isAdvancedPresetRecord(rawField) ? { ...rawField } : {};
    Object.entries(fallback).forEach(([key, value]) => {
      if (!(key in field)) field[key] = value;
    });
    return field;
  };
  return cloneAdvancedPresetFieldWithDefaults;
}
