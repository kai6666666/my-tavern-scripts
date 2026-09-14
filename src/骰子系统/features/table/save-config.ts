// @ts-nocheck
/**
 * save-config.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { STORAGE_KEY_UI_CONFIG } from '../../shared/storage-keys';
import { Store } from '../../shared/storage/store';
import { setDatabaseToastMute } from '../../shared/database-toast-mute';
export function createSaveConfig(deps: any) {
  const saveConfig = newCfg => {
    deps.set_configCache(deps.sanitizeUiConfig({ ...deps.getConfig(), ...newCfg }));
    Store.set(STORAGE_KEY_UI_CONFIG, deps.get_configCache());
    deps.applyConfigStyles(deps.get_configCache());
    setDatabaseToastMute(deps.get_configCache().muteDatabaseToasts === true);
  };
  return saveConfig;
}
