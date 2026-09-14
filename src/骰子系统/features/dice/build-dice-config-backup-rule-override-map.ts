// @ts-nocheck
/**
 * build-dice-config-backup-rule-override-map.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createBuildDiceConfigBackupRuleOverrideMap(deps: any) {
  const buildDiceConfigBackupRuleOverrideMap = (
    rules: readonly Record<string, unknown>[],
    getRuleKey: (rule: Record<string, unknown>) => string,
  ): Map<string, Record<string, unknown>> => {
    const result = new Map<string, Record<string, unknown>>();
    rules.forEach(rule => {
      if (rule.builtin !== true) return;
      const key = getRuleKey(rule);
      if (key) result.set(key, rule);
    });
    return result;
  };
  return buildDiceConfigBackupRuleOverrideMap;
}
