// @ts-nocheck
/**
 * get-all-dice-config-backup-module-ids.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { DICE_CONFIG_BACKUP_MODULES } from './dice-config-backup-modules';
export function createGetAllDiceConfigBackupModuleIds(deps: any) {
  const getAllDiceConfigBackupModuleIds = (): DiceConfigBackupModuleId[] =>
    DICE_CONFIG_BACKUP_MODULES.map(module => module.id);
  return getAllDiceConfigBackupModuleIds;
}
