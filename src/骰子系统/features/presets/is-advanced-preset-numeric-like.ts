// @ts-nocheck
/**
 * is-advanced-preset-numeric-like.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createIsAdvancedPresetNumericLike(deps: any) {
  const isAdvancedPresetNumericLike = (value: unknown): boolean => {
    if (typeof value === 'number') return Number.isFinite(value);
    if (typeof value === 'string' && value.trim()) return Number.isFinite(Number(value));
    return false;
  };
  return isAdvancedPresetNumericLike;
}
