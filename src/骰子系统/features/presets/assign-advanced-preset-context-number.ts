// @ts-nocheck
/**
 * assign-advanced-preset-context-number.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { RollResult } from '../../shared/types';
export function createAssignAdvancedPresetContextNumber(deps: any) {
  const assignAdvancedPresetContextNumber = (
    context: Record<string, string | number | boolean | RollResult>,
    key: string,
    value: unknown,
  ): void => {
    const numericValue = deps.coerceAdvancedPresetContextNumber(value, Number.NaN);
    if (!Number.isFinite(numericValue)) return;
    context[key.startsWith('$') ? key : `$${key}`] = numericValue;
  };
  return assignAdvancedPresetContextNumber;
}
