// @ts-nocheck
/**
 * get-dice-config.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { DEFAULT_DICE_CONFIG } from '../../shared/defaults-config';
import { STORAGE_KEY_DICE_CONFIG } from '../../shared/storage-keys';
import { Store } from '../../shared/storage/store';
export function createGetDiceConfig(deps: any) {
  const getDiceConfig = () => Store.get(STORAGE_KEY_DICE_CONFIG, DEFAULT_DICE_CONFIG);
  return getDiceConfig;
}
