// @ts-nocheck
/**
 * sanitize-dice-config-backup-stored-value.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { STORAGE_KEY_PRESETS, STORAGE_KEY_REGEX_PRESETS, STORAGE_KEY_REGEX_RULES, STORAGE_KEY_TABLE_TEMPLATE_REQUIREMENT_PRESETS, STORAGE_KEY_VALIDATION_RULES } from '../../shared/storage-keys';
export function createSanitizeDiceConfigBackupStoredValue(deps: any) {
  const sanitizeDiceConfigBackupStoredValue = (key: string, value: unknown): unknown => {
    if (key === STORAGE_KEY_PRESETS)
      return deps.sanitizeDiceConfigBackupPresetRules(value, deps.sanitizeDiceConfigBackupValidationRule);
    if (key === STORAGE_KEY_VALIDATION_RULES)
      return deps.sanitizeDiceConfigBackupRuleList(value, deps.sanitizeDiceConfigBackupValidationRule);
    if (key === STORAGE_KEY_REGEX_PRESETS)
      return deps.sanitizeDiceConfigBackupPresetRules(value, deps.sanitizeDiceConfigBackupRegexRule);
    if (key === STORAGE_KEY_REGEX_RULES)
      return deps.sanitizeDiceConfigBackupRuleList(value, deps.sanitizeDiceConfigBackupRegexRule);
    if (key === STORAGE_KEY_TABLE_TEMPLATE_REQUIREMENT_PRESETS) {
      return deps.sanitizeDiceConfigBackupCustomOnlyPresetArrayForExport(value, key);
    }
    return value;
  };
  return sanitizeDiceConfigBackupStoredValue;
}
