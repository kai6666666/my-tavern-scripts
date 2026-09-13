// @ts-nocheck
import { rollComplexDiceExpression } from './dice-engine';
/**
 * parse-check-suggestion-modifier-value.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createParseCheckSuggestionModifierValue(deps: any) {
  const parseCheckSuggestionModifierValue = (value: string): number => {
    const trimmed = String(value || '').trim();
    if (!trimmed) return 0;
    if (/^-?\d+(?:\.\d+)?$/.test(trimmed)) return Number(trimmed);
    const rollResult = rollComplexDiceExpression(trimmed);
    if (!Number.isNaN(rollResult.total)) return rollResult.total;
    const formulaValue = deps.evaluateFormula(trimmed, {});
    return Number.isFinite(formulaValue) ? formulaValue : 0;
  };
  return parseCheckSuggestionModifierValue;
}
