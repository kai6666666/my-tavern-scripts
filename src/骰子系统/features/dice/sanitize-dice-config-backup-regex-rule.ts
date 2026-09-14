// @ts-nocheck
/**
 * sanitize-dice-config-backup-regex-rule.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createSanitizeDiceConfigBackupRegexRule(deps: any) {
  const sanitizeDiceConfigBackupRegexRule = (rule: unknown): Record<string, unknown> | null => {
    if (!deps.isDiceConfigBackupRecord(rule)) return null;
    if (rule.builtin === true) {
      const id = deps.getDiceConfigBackupRegexRuleKey(rule);
      if (!id) return null;
      if (deps.getDEPRECATED_BUILTIN_REGEX_RULE_IDS().has(id)) return null;
      const result: Record<string, unknown> = { id, builtin: true };
      deps.copyDiceConfigBackupExistingFields(rule, result, ['enabled']);
      return result;
    }
    const customRule = deps.cloneDiceConfigBackupValue(rule);
    customRule.builtin = false;
    return customRule;
  };
  return sanitizeDiceConfigBackupRegexRule;
}
