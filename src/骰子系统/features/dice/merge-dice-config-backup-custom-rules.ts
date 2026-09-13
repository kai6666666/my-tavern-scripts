// @ts-nocheck
/**
 * merge-dice-config-backup-custom-rules.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createMergeDiceConfigBackupCustomRules(deps: any) {
  const mergeDiceConfigBackupCustomRules = (
    currentRules: readonly Record<string, unknown>[],
    incomingRules: readonly Record<string, unknown>[],
    builtinKeys: ReadonlySet<string>,
    getRuleKey: (rule: Record<string, unknown>) => string,
  ): Record<string, unknown>[] => {
    const result: Record<string, unknown>[] = [];
    const indexByKey = new Map<string, number>();

    const addRule = (rule: Record<string, unknown>, overwrite: boolean): void => {
      if (rule.builtin === true) return;
      const key = getRuleKey(rule);
      if (key && builtinKeys.has(key)) return;
      const cloned = deps.cloneDiceConfigBackupValue(rule);
      cloned.builtin = false;
      if (key && indexByKey.has(key)) {
        if (overwrite) result[indexByKey.get(key)!] = cloned;
        return;
      }
      if (key) indexByKey.set(key, result.length);
      result.push(cloned);
    };

    currentRules.forEach(rule => addRule(rule, false));
    incomingRules.forEach(rule => addRule(rule, true));
    return result;
  };
  return mergeDiceConfigBackupCustomRules;
}
