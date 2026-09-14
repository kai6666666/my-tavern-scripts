// @ts-nocheck
/**
 * normalize-dice-profile-module-ids.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createNormalizeDiceProfileModuleIds(deps: any) {
  const normalizeDiceProfileModuleIds = (
    moduleIds: readonly string[] | undefined,
    backup?: DiceConfigBackupDocument,
  ): DiceConfigBackupModuleId[] => {
    const normalized = deps.normalizeDiceConfigBackupSelectedModuleIds(moduleIds || []);
    const available = backup ? deps.getDiceConfigBackupAvailableModuleIds(backup) : deps.getAllDiceConfigBackupModuleIds();
    const availableSet = new Set(available);
    const filtered = normalized.filter(moduleId => availableSet.has(moduleId));
    return filtered.length > 0 ? filtered : available;
  };
  return normalizeDiceProfileModuleIds;
}
