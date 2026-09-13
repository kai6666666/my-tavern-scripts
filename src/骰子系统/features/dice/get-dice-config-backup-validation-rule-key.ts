// @ts-nocheck
/**
 * get-dice-config-backup-validation-rule-key.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetDiceConfigBackupValidationRuleKey(deps: any) {
  const getDiceConfigBackupValidationRuleKey = (rule: Record<string, unknown>): string => {
    const id = deps.getDiceConfigBackupRecordString(rule, 'id');
    if (id) return id;
    const targetTable = deps.getDiceConfigBackupRecordString(rule, 'targetTable');
    const ruleType = deps.getDiceConfigBackupRecordString(rule, 'ruleType');
    return targetTable && ruleType ? `${targetTable}_${ruleType}` : '';
  };
  return getDiceConfigBackupValidationRuleKey;
}
