// @ts-nocheck
/**
 * get-dice-config-backup-module-definition.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetDiceConfigBackupModuleDefinition(deps: any) {
  const getDiceConfigBackupModuleDefinition = (moduleId: DiceConfigBackupModuleId) =>
    deps.getDICE_CONFIG_BACKUP_MODULES().find(module => module.id === moduleId) || null;
  return getDiceConfigBackupModuleDefinition;
}
