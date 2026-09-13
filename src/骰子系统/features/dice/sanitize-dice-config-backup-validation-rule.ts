// @ts-nocheck
/**
 * sanitize-dice-config-backup-validation-rule.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createSanitizeDiceConfigBackupValidationRule(deps: any) {
  const sanitizeDiceConfigBackupValidationRule = (rule: unknown): Record<string, unknown> | null => {
    if (!deps.isDiceConfigBackupRecord(rule)) return null;
    if (rule.builtin === true) {
      const key = deps.getDiceConfigBackupValidationRuleKey(rule);
      if (!key) return null;
      const result: Record<string, unknown> = { builtin: true };
      deps.copyDiceConfigBackupExistingFields(rule, result, [
        'id',
        'targetTable',
        'ruleType',
        'enabled',
        'intercept',
        'errorMessage',
      ]);
      return result;
    }
    const customRule = deps.cloneDiceConfigBackupValue(rule);
    customRule.builtin = false;
    return customRule;
  };
  return sanitizeDiceConfigBackupValidationRule;
}
