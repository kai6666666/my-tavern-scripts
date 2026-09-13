// @ts-nocheck
/**
 * get-global-interaction-rule-keywords.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetGlobalInteractionRuleKeywords(deps: any) {
  const getGlobalInteractionRuleKeywords = (rule: unknown): string[] => {
    if (!deps.isRecord(rule) || !Array.isArray(rule.table_keywords)) return [];
    return rule.table_keywords.map(keyword => deps.getStringLikeCellText(keyword)).filter(Boolean);
  };
  return getGlobalInteractionRuleKeywords;
}
