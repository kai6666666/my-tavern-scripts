// @ts-nocheck
/**
 * save-crazy-mode-config.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { Store } from '../../shared/storage/store';
import { STORAGE_KEY_CRAZY_MODE } from '../../shared/storage-keys';
export function createSaveCrazyModeConfig(deps: any) {
  const saveCrazyModeConfig = config => {
    Store.set(STORAGE_KEY_CRAZY_MODE, config);
  };
  return saveCrazyModeConfig;
}
