// @ts-nocheck
/**
 * merge-dice-config-backup-validation-rules.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { BUILTIN_VALIDATION_RULES } from '../../features/validation/builtin-validation-rules';
export function createMergeDiceConfigBackupValidationRules(deps: any) {
  const mergeDiceConfigBackupValidationRules = (current: unknown, incoming: unknown): Record<string, unknown>[] => {
    const currentRules = deps.getDiceConfigBackupRuleRecords(current, deps.sanitizeDiceConfigBackupValidationRule);
    const incomingRules = deps.getDiceConfigBackupRuleRecords(incoming, deps.sanitizeDiceConfigBackupValidationRule);
    const currentOverrides = deps.buildDiceConfigBackupRuleOverrideMap(currentRules, deps.getDiceConfigBackupValidationRuleKey);
    const incomingOverrides = deps.buildDiceConfigBackupRuleOverrideMap(incomingRules, deps.getDiceConfigBackupValidationRuleKey);
    const builtinRules = BUILTIN_VALIDATION_RULES.map(rule => {
      const baseRule = deps.cloneDiceConfigBackupValue(rule) as Record<string, unknown>;
      const key = deps.getDiceConfigBackupValidationRuleKey(baseRule);
      return deps.applyDiceConfigBackupRuleOverrides(
        baseRule,
        key,
        [currentOverrides, incomingOverrides],
        ['enabled', 'intercept', 'errorMessage'],
      );
    });
    const builtinKeys = new Set(builtinRules.map(deps.getDiceConfigBackupValidationRuleKey).filter(Boolean));
    return [
      ...builtinRules,
      ...deps.mergeDiceConfigBackupCustomRules(
        currentRules,
        incomingRules,
        builtinKeys,
        deps.getDiceConfigBackupValidationRuleKey,
      ),
    ];
  };
  return mergeDiceConfigBackupValidationRules;
}
