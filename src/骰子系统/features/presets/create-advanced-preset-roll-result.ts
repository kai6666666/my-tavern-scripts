// @ts-nocheck
/**
 * create-advanced-preset-roll-result.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { RollResult } from '../../shared/types';
export function createCreateAdvancedPresetRollResult(deps: any) {
  const createAdvancedPresetRollResult = (total: number, tags: string[] = []): RollResult => ({
    total,
    rawDice: [total],
    keptDice: [total],
    formula: String(total),
    breakdown: String(total),
    tags,
  });
  return createAdvancedPresetRollResult;
}
