// @ts-nocheck
/**
 * normalize-dice-config-backup-selected-module-ids.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createNormalizeDiceConfigBackupSelectedModuleIds(deps: any) {
  const normalizeDiceConfigBackupSelectedModuleIds = (moduleIds: readonly string[]): DiceConfigBackupModuleId[] => {
    const result: DiceConfigBackupModuleId[] = [];
    moduleIds.forEach(moduleId => {
      if (!deps.isDiceConfigBackupModuleId(moduleId)) return;
      if (!result.includes(moduleId)) result.push(moduleId);
    });
    return result;
  };
  return normalizeDiceConfigBackupSelectedModuleIds;
}
