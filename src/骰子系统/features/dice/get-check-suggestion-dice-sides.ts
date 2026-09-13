// @ts-nocheck
/**
 * get-check-suggestion-dice-sides.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetCheckSuggestionDiceSides(deps: any) {
  const getCheckSuggestionDiceSides = (formula: string): number => {
    const match = String(formula || '').match(/\d*d(\d+)/i);
    if (!match) return 100;
    const sides = parseInt(match[1], 10);
    return Number.isNaN(sides) ? 100 : sides;
  };
  return getCheckSuggestionDiceSides;
}
