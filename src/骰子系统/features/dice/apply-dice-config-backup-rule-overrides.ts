// @ts-nocheck
/**
 * apply-dice-config-backup-rule-overrides.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createApplyDiceConfigBackupRuleOverrides(deps: any) {
  const applyDiceConfigBackupRuleOverrides = (
    baseRule: Record<string, unknown>,
    ruleKey: string,
    overrideMaps: readonly Map<string, Record<string, unknown>>[],
    fields: readonly string[],
  ): Record<string, unknown> => {
    const result = deps.cloneDiceConfigBackupValue(baseRule);
    result.builtin = true;
    overrideMaps.forEach(overrides => {
      const override = overrides.get(ruleKey);
      if (override) deps.copyDiceConfigBackupExistingFields(override, result, fields);
    });
    return result;
  };
  return applyDiceConfigBackupRuleOverrides;
}
