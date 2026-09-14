// @ts-nocheck
/**
 * get-crazy-mode-config.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { STORAGE_KEY_CRAZY_MODE } from '../../shared/storage-keys';
import { Store } from '../../shared/storage/store';
import { DEFAULT_CRAZY_MODE_CONFIG } from '../../shared/defaults-config';
export function createGetCrazyModeConfig(deps: any) {
  const getCrazyModeConfig = () => {
    const stored = Store.get(STORAGE_KEY_CRAZY_MODE, null);
    if (!stored) return { ...DEFAULT_CRAZY_MODE_CONFIG };
    return { ...DEFAULT_CRAZY_MODE_CONFIG, ...stored };
  };
  return getCrazyModeConfig;
}
