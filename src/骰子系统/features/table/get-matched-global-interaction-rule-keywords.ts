// @ts-nocheck
/**
 * get-matched-global-interaction-rule-keywords.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetMatchedGlobalInteractionRuleKeywords(deps: any) {
  const getMatchedGlobalInteractionRuleKeywords = (tableName: string): string[] => {
    const normalizedTableName = deps.normalizeGlobalInteractionCategoryText(tableName);
    for (const rule of deps.getGlobalInteractionActionRuleGroups()) {
      const matched = rule.table_keywords.some(keyword =>
        normalizedTableName.includes(deps.normalizeGlobalInteractionCategoryText(keyword)),
      );
      if (matched) return rule.table_keywords;
    }
    return [];
  };
  return getMatchedGlobalInteractionRuleKeywords;
}
