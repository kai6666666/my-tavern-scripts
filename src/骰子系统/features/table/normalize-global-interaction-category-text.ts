// @ts-nocheck
/**
 * normalize-global-interaction-category-text.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createNormalizeGlobalInteractionCategoryText(deps: any) {
  const normalizeGlobalInteractionCategoryText = (value: unknown): string =>
    String(value ?? '')
      .trim()
      .replace(/\s+/g, '')
      .toLowerCase();

  const getGlobalInteractionRuleKeywords = (rule: unknown): string[] => {
    if (!isRecord(rule) || !Array.isArray(rule.table_keywords)) return [];
    return rule.table_keywords.map(keyword => getStringLikeCellText(keyword)).filter(Boolean);
  };
  return normalizeGlobalInteractionCategoryText;
}
