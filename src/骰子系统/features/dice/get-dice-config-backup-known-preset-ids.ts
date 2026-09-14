// @ts-nocheck
/**
 * get-dice-config-backup-known-preset-ids.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { STORAGE_KEY_TABLE_TEMPLATE_REQUIREMENT_PRESETS } from '../../shared/storage-keys';
import { Store } from '../../shared/storage/store';
import { normalizeTableTemplateRequirementPreset } from '../../features/table/table-template-requirements';
export function createGetDiceConfigBackupKnownPresetIds(deps: any) {
  const getDiceConfigBackupKnownPresetIds = (presetKey: string): Set<string> => {
    const result = new Set(deps.getDiceConfigBackupBuiltinPresetIds(presetKey));
    const stored = Store.get(presetKey, []);
    if (Array.isArray(stored)) {
      stored.forEach(item => {
        const preset =
          presetKey === STORAGE_KEY_TABLE_TEMPLATE_REQUIREMENT_PRESETS
            ? deps.isDiceConfigBackupRecord(item) &&
              deps.getDiceConfigBackupPresetRecordId(item) &&
              item.builtin !== true
              ? normalizeTableTemplateRequirementPreset(item, deps.getDiceConfigBackupPresetRecordId(item))
              : null
            : deps.isDiceConfigBackupRecord(item)
              ? item
              : null;
        if (!preset || !deps.isDiceConfigBackupRecord(preset)) return;
        const id = deps.getDiceConfigBackupPresetRecordId(preset);
        if (id && preset.builtin !== true && !deps.getDiceConfigBackupBuiltinPresetIds(presetKey).includes(id)) result.add(id);
      });
    }
    return result;
  };
  return getDiceConfigBackupKnownPresetIds;
}
