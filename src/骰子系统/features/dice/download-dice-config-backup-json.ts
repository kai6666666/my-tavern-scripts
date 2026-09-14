// @ts-nocheck
/**
 * download-dice-config-backup-json.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createDownloadDiceConfigBackupJson(deps: any) {
  const downloadDiceConfigBackupJson = (backup: DiceConfigBackupDocument): void => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    deps.downloadJsonFile(JSON.stringify(backup, null, 2), `acu_dice_config_backup_${timestamp}.json`);
  };
  return downloadDiceConfigBackupJson;
}
