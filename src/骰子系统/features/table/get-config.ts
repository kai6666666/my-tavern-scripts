// @ts-nocheck
/**
 * get-config.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { Store } from '../../shared/storage/store';
import { STORAGE_KEY_UI_CONFIG } from '../../shared/storage-keys';
import { DEFAULT_CONFIG } from '../../shared/defaults-config';
export function createGetConfig(deps: any) {
  const getConfig = () => {
    if (!deps.get_configCache()) {
      const storedConfig = Store.get(STORAGE_KEY_UI_CONFIG, {}) || {};
      const storedConfigObject = typeof storedConfig === 'object' ? storedConfig : {};
      const mergedConfig = { ...DEFAULT_CONFIG, ...storedConfigObject };
      deps.set_configCache(deps.sanitizeUiConfig(mergedConfig));
      const needsWriteback =
        Object.prototype.hasOwnProperty.call(storedConfigObject, deps.getLEGACY_DB_THEME_SYNC_CONFIG_KEY()) ||
        mergedConfig.collapseStyle !== deps.get_configCache().collapseStyle;
      if (needsWriteback) {
        Store.set(STORAGE_KEY_UI_CONFIG, deps.get_configCache());
      }
    }
    return deps.get_configCache();
  };
  return getConfig;
}
