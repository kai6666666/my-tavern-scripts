// @ts-nocheck
/**
 * extract-check-suggestion-tie-rule.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createExtractCheckSuggestionTieRule(deps: any) {
  const extractCheckSuggestionTieRule = (
    text: string,
  ): { rest: string; tieRule: CheckSuggestionTieRule; hasExplicitTieRule: boolean } => {
    const match = text.match(/平局\s*=\s*([^\s，,。；;]+)/);
    if (!match || match.index === undefined)
      return { rest: text, tieRule: 'initiator_lose', hasExplicitTieRule: false };
    return {
      rest: `${text.slice(0, match.index)} ${text.slice(match.index + match[0].length)}`.replace(/\s+/g, ' ').trim(),
      tieRule: deps.parseCheckSuggestionTieRule(match[1]),
      hasExplicitTieRule: true,
    };
  };
  return extractCheckSuggestionTieRule;
}
