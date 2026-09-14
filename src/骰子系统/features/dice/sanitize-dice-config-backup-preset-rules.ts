// @ts-nocheck
/**
 * sanitize-dice-config-backup-preset-rules.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createSanitizeDiceConfigBackupPresetRules(deps: any) {
  const sanitizeDiceConfigBackupPresetRules = (
    value: unknown,
    sanitizeRule: (rule: unknown) => Record<string, unknown> | null,
  ): unknown => {
    if (!Array.isArray(value)) return value;
    return value.map(item => {
      if (!deps.isDiceConfigBackupRecord(item)) return item === undefined ? undefined : deps.cloneDiceConfigBackupValue(item);
      const preset = deps.cloneDiceConfigBackupValue(item);
      preset.rules = deps.sanitizeDiceConfigBackupRuleList(preset.rules, sanitizeRule);
      return preset;
    });
  };
  return sanitizeDiceConfigBackupPresetRules;
}
