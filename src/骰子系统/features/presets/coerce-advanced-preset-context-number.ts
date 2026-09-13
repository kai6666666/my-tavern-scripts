// @ts-nocheck
/**
 * coerce-advanced-preset-context-number.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createCoerceAdvancedPresetContextNumber(deps: any) {
  const coerceAdvancedPresetContextNumber = (value: unknown, fallback: number): number => {
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'boolean') return value ? 1 : 0;
    if (typeof value === 'string' && value.trim()) {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) return parsed;
    }
    return fallback;
  };
  return coerceAdvancedPresetContextNumber;
}
