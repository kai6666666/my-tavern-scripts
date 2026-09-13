// @ts-nocheck
/**
 * apply-dice-config-backup-active-value.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { STORAGE_KEY_ACTIVE_ADVANCED_PRESET, STORAGE_KEY_LAST_PRESET } from '../../shared/storage-keys';
export function createApplyDiceConfigBackupActiveValue(deps: any) {
  const applyDiceConfigBackupActiveValue = (
    write: DiceConfigBackupPendingActiveWrite,
    stats: DiceConfigBackupApplyStats,
    idMappings: Map<string, Map<string, string>>,
  ): void => {
    const presetKey = deps.DICE_CONFIG_BACKUP_ACTIVE_KEY_TO_PRESET_KEY[write.key];
    if (!presetKey) {
      deps.applyDiceConfigBackupValue(write.key, write.value, write.moduleName, stats, idMappings);
      return;
    }

    if (write.value === null && write.key === STORAGE_KEY_ACTIVE_ADVANCED_PRESET) {
      deps.applyDiceConfigBackupValue(write.key, null, write.moduleName, stats, idMappings);
      return;
    }

    if (typeof write.value !== 'string' && typeof write.value !== 'number') {
      stats.skipped += 1;
      stats.warnings.push(`${write.moduleName}: ${write.key} 不是有效的预设 ID，已保留当前值。`);
      return;
    }

    const sourceId = String(write.value).trim();
    if (!sourceId) {
      stats.skipped += 1;
      stats.warnings.push(`${write.moduleName}: ${write.key} 为空，已保留当前值。`);
      return;
    }

    const mappedId = idMappings.get(presetKey)?.get(sourceId) || sourceId;
    const isCustomAdvanced = write.key === STORAGE_KEY_LAST_PRESET && mappedId === deps.CUSTOM_ROLL_MODE.id;
    if (!isCustomAdvanced && !deps.getDiceConfigBackupKnownPresetIds(presetKey).has(mappedId)) {
      stats.skipped += 1;
      stats.warnings.push(`${write.moduleName}: 预设 ID "${sourceId}" 不存在，已保留当前激活项。`);
      return;
    }

    deps.applyDiceConfigBackupValue(write.key, mappedId, write.moduleName, stats, idMappings);
  };
  return applyDiceConfigBackupActiveValue;
}
