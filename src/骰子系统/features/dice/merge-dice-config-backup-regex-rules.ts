// @ts-nocheck
/**
 * merge-dice-config-backup-regex-rules.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { BUILTIN_REGEX_RULES } from '../regex/builtin-regex-rules';
export function createMergeDiceConfigBackupRegexRules(deps: any) {
  const mergeDiceConfigBackupRegexRules = (current: unknown, incoming: unknown): Record<string, unknown>[] => {
    const currentRules = deps.getDiceConfigBackupRuleRecords(current, deps.sanitizeDiceConfigBackupRegexRule);
    const incomingRules = deps.getDiceConfigBackupRuleRecords(incoming, deps.sanitizeDiceConfigBackupRegexRule);
    const currentOverrides = deps.buildDiceConfigBackupRuleOverrideMap(currentRules, deps.getDiceConfigBackupRegexRuleKey);
    const incomingOverrides = deps.buildDiceConfigBackupRuleOverrideMap(incomingRules, deps.getDiceConfigBackupRegexRuleKey);
    const builtinRules = BUILTIN_REGEX_RULES.map(rule => {
      const baseRule = deps.cloneDiceConfigBackupValue(rule) as Record<string, unknown>;
      const key = deps.getDiceConfigBackupRegexRuleKey(baseRule);
      return deps.applyDiceConfigBackupRuleOverrides(baseRule, key, [currentOverrides, incomingOverrides], ['enabled']);
    });
    const builtinKeys = new Set(builtinRules.map(deps.getDiceConfigBackupRegexRuleKey).filter(Boolean));
    return [
      ...builtinRules,
      ...deps.mergeDiceConfigBackupCustomRules(currentRules, incomingRules, builtinKeys, deps.getDiceConfigBackupRegexRuleKey),
    ];
  };
  return mergeDiceConfigBackupRegexRules;
}
