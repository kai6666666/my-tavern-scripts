// @ts-nocheck
/**
 * extract-check-suggestion-dice-formula.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createExtractCheckSuggestionDiceFormula(deps: any) {
  const extractCheckSuggestionDiceFormula = (
    text: string,
  ): { rest: string; diceType: string; hasExplicitDice: boolean } => {
    const match = text.match(/(^|\s)([.。]?r?(?:\d*)d(?:\d+|F)(?:[a-z]+\d+)?)(?=$|\s)/i);
    if (!match || match.index === undefined) return { rest: text, diceType: '1d100', hasExplicitDice: false };
    const before = text.slice(0, match.index);
    const after = text.slice(match.index + match[0].length);
    return {
      rest: `${before} ${after}`.replace(/\s+/g, ' ').trim(),
      diceType: deps.normalizeCheckSuggestionDiceFormula(match[2]),
      hasExplicitDice: true,
    };
  };
  return extractCheckSuggestionDiceFormula;
}
