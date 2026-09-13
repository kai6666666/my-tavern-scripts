// @ts-nocheck
/**
 * get-dice-config-backup-available-module-ids.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { DICE_CONFIG_BACKUP_MODULES } from './dice-config-backup-modules';
export function createGetDiceConfigBackupAvailableModuleIds(deps: any) {
  const getDiceConfigBackupAvailableModuleIds = (backup: DiceConfigBackupDocument): DiceConfigBackupModuleId[] =>
    DICE_CONFIG_BACKUP_MODULES.filter(module => {
      const payload = backup.modules[module.id];
      if (!payload) return false;
      if (module.id === 'tableTemplate') return deps.hasDiceConfigBackupTableTemplateResource(payload);
      return (
        deps.hasDiceConfigBackupRecoverableStorage(payload, module) ||
        deps.getDiceConfigBackupModuleResourceCount(payload, module.id) > 0
      );
    }).map(module => module.id);
  return getDiceConfigBackupAvailableModuleIds;
}
