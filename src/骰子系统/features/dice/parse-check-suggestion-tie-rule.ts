// @ts-nocheck
/**
 * parse-check-suggestion-tie-rule.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createParseCheckSuggestionTieRule(deps: any) {
  const parseCheckSuggestionTieRule = (rawRule: string): CheckSuggestionTieRule => {
    const rule = rawRule.trim().toLowerCase();
    if (/(发起方|左方|initiator|left).*(成功|胜|赢|win)/.test(rule) || rule === '发起方成功') {
      return 'initiator_win';
    }
    if (/^(平局|平手|tie|保留平局)$/.test(rule)) {
      return 'tie';
    }
    return 'initiator_lose';
  };
  return parseCheckSuggestionTieRule;
}
