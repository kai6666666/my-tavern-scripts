// @ts-nocheck
/**
 * normalize-check-suggestion-dice-formula.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createNormalizeCheckSuggestionDiceFormula(deps: any) {
  const normalizeCheckSuggestionDiceFormula = (rawFormula: string): string => {
    const cleaned = String(rawFormula || '')
      .trim()
      .replace(/^[.。]/, '')
      .replace(/^r(?=\d*d)/i, '');
    return cleaned || '1d100';
  };
  return normalizeCheckSuggestionDiceFormula;
}
