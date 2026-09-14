// @ts-nocheck
/**
 * get-dice-config-backup-rule-records.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetDiceConfigBackupRuleRecords(deps: any) {
  const getDiceConfigBackupRuleRecords = (
    value: unknown,
    sanitizeRule: (rule: unknown) => Record<string, unknown> | null,
  ): Record<string, unknown>[] => {
    if (!Array.isArray(value)) return [];
    return value.map(sanitizeRule).filter((rule): rule is Record<string, unknown> => Boolean(rule));
  };
  return getDiceConfigBackupRuleRecords;
}
