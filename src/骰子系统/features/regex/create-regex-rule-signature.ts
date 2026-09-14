// @ts-nocheck
/**
 * create-regex-rule-signature.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createCreateRegexRuleSignature(deps: any) {
  const createRegexRuleSignature = (rules: readonly RegexTransformationRule[]): string =>
    JSON.stringify(
      rules.map(rule => ({
        id: rule.id,
        operation: rule.operation,
        pattern: rule.pattern,
        flags: rule.flags,
        replacement: rule.replacement,
        scope: rule.scope,
        priority: rule.priority,
        executeMode: rule.executeMode,
        enabled: rule.enabled,
      })),
    );
  return createRegexRuleSignature;
}
