// @ts-nocheck
/**
 * sanitize-dice-config-backup-rule-list.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createSanitizeDiceConfigBackupRuleList(deps: any) {
  const sanitizeDiceConfigBackupRuleList = (
    value: unknown,
    sanitizeRule: (rule: unknown) => Record<string, unknown> | null,
  ): unknown => {
    if (!Array.isArray(value)) return value;
    return value.map(sanitizeRule).filter((rule): rule is Record<string, unknown> => Boolean(rule));
  };
  return sanitizeDiceConfigBackupRuleList;
}
