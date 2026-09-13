// @ts-nocheck
/**
 * get-dice-config-backup-regex-rule-key.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetDiceConfigBackupRegexRuleKey(deps: any) {
  const getDiceConfigBackupRegexRuleKey = (rule: Record<string, unknown>): string =>
    deps.getDiceConfigBackupRecordString(rule, 'id');
  return getDiceConfigBackupRegexRuleKey;
}
