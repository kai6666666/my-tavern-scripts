// @ts-nocheck
/**
 * is-deprecated-builtin-regex-rule.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createIsDeprecatedBuiltinRegexRule(deps: any) {
  const isDeprecatedBuiltinRegexRule = (rule: { id?: string; builtin?: boolean } | null | undefined): boolean =>
    Boolean(rule?.builtin === true && rule.id && deps.getDEPRECATED_BUILTIN_REGEX_RULE_IDS().has(rule.id));
  return isDeprecatedBuiltinRegexRule;
}
