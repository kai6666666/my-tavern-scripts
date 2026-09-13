// @ts-nocheck
/**
 * get-dice-config-backup-safe-current-presets.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { STORAGE_KEY_PRESETS, STORAGE_KEY_REGEX_PRESETS } from '../../shared/storage-keys';
export function createGetDiceConfigBackupSafeCurrentPresets(deps: any) {
  const getDiceConfigBackupSafeCurrentPresets = (key: string, current: unknown): unknown[] => {
    if (key === STORAGE_KEY_PRESETS) return deps.cloneDiceConfigBackupValue(deps.getPresetManager().getAllPresets() || []);
    if (key === STORAGE_KEY_REGEX_PRESETS) return deps.cloneDiceConfigBackupValue(deps.getRegexPresetManager().getAllPresets() || []);
    return Array.isArray(current) ? deps.cloneDiceConfigBackupValue(current) : [];
  };
  return getDiceConfigBackupSafeCurrentPresets;
}
