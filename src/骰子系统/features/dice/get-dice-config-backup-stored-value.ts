// @ts-nocheck
/**
 * get-dice-config-backup-stored-value.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { DEFAULT_DICE_CONFIG, DEFAULT_GM_CONFIG } from '../../shared/defaults-config';
import { STORAGE_KEY_ACTIVE_TABLE_TEMPLATE_REQUIREMENT_PRESET, STORAGE_KEY_CRAZY_MODE, STORAGE_KEY_DICE_CONFIG, STORAGE_KEY_GM_CONFIG, STORAGE_KEY_UI_CONFIG } from '../../shared/storage-keys';
import { Store } from '../../shared/storage/store';
export function createGetDiceConfigBackupStoredValue(deps: any) {
  const getDiceConfigBackupStoredValue = (key: string): unknown => {
    if (deps.getDiceConfigBackupKeyStrategy(key) === 'rawString') {
      const raw = localStorage.getItem(key);
      return raw === null ? undefined : raw;
    }
    if (key === STORAGE_KEY_UI_CONFIG) return deps.getConfig();
    if (key === STORAGE_KEY_DICE_CONFIG) {
      const diceConfig = deps.getDiceConfig();
      return deps.isDiceConfigBackupRecord(diceConfig) ? { ...DEFAULT_DICE_CONFIG, ...diceConfig } : DEFAULT_DICE_CONFIG;
    }
    if (key === STORAGE_KEY_CRAZY_MODE) return deps.getCrazyModeConfig();
    if (key === STORAGE_KEY_GM_CONFIG && localStorage.getItem(key) !== null) return Store.get(key, DEFAULT_GM_CONFIG);
    if (key === STORAGE_KEY_ACTIVE_TABLE_TEMPLATE_REQUIREMENT_PRESET)
      return deps.TableTemplateRequirementPresetManager.getActivePresetId();

    if (localStorage.getItem(key) === null) return undefined;
    return Store.get(key, null);
  };
  return getDiceConfigBackupStoredValue;
}
