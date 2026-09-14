// @ts-nocheck
/**
 * get-dice-config-backup-builtin-preset-ids.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { BUILTIN_ACTION_PRESETS } from '../presets/builtin-action-presets';
import { BUILTIN_ADVANCED_PRESETS } from '../presets/builtin-advanced-presets';
import { BUILTIN_ATTRIBUTE_PRESETS } from '../presets/builtin-attribute-presets';
import { STORAGE_KEY_ACTION_PRESETS, STORAGE_KEY_ADVANCED_PRESETS, STORAGE_KEY_ATTRIBUTE_PRESETS, STORAGE_KEY_DASHBOARD_PRESETS, STORAGE_KEY_PRESETS, STORAGE_KEY_REGEX_PRESETS, STORAGE_KEY_RENDER_PRESETS, STORAGE_KEY_TABLE_TEMPLATE_REQUIREMENT_PRESETS } from '../../shared/storage-keys';
export function createGetDiceConfigBackupBuiltinPresetIds(deps: any) {
  const getDiceConfigBackupBuiltinPresetIds = (presetKey: string): string[] => {
    if (presetKey === STORAGE_KEY_ADVANCED_PRESETS) return BUILTIN_ADVANCED_PRESETS.map(preset => preset.id);
    if (presetKey === STORAGE_KEY_ATTRIBUTE_PRESETS) return BUILTIN_ATTRIBUTE_PRESETS.map(preset => String(preset.id));
    if (presetKey === STORAGE_KEY_ACTION_PRESETS) return BUILTIN_ACTION_PRESETS.map(preset => String(preset.id));
    if (presetKey === STORAGE_KEY_DASHBOARD_PRESETS) return [deps.getDASHBOARD_DEFAULT_PRESET_ID()];
    if (presetKey === STORAGE_KEY_RENDER_PRESETS) return [deps.getRENDER_DEFAULT_PRESET_ID()];
    if (presetKey === STORAGE_KEY_TABLE_TEMPLATE_REQUIREMENT_PRESETS)
      return deps.getBUILTIN_TABLE_TEMPLATE_REQUIREMENT_PRESETS().map(preset => preset.id);
    if (presetKey === STORAGE_KEY_PRESETS) return ['default'];
    if (presetKey === STORAGE_KEY_REGEX_PRESETS) return ['regex_default'];
    return [];
  };
  return getDiceConfigBackupBuiltinPresetIds;
}
