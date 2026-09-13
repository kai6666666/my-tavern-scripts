// @ts-nocheck
/**
 * save-dice-config.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { STORAGE_KEY_DICE_CONFIG } from '../../shared/storage-keys';
import { Store } from '../../shared/storage/store';
export function createSaveDiceConfig(deps: any) {
  const saveDiceConfig = cfg => {
    const oldCfg = deps.getDiceConfig();
    const newCfg = { ...oldCfg, ...cfg };
    Store.set(STORAGE_KEY_DICE_CONFIG, newCfg);
    // 记录配置变更
    const changedKeys = Object.keys(cfg).filter(k => oldCfg[k] !== newCfg[k]);
    if (changedKeys.length > 0) {
      console.info(`[DICE]投骰配置已更新: ${changedKeys.join(', ')}`);
    }
  };
  return saveDiceConfig;
}
