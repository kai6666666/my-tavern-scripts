// @ts-nocheck
/**
 * gacha-store-instance.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { GachaStore } from './gacha-store';
import { Store } from '../../shared/storage/store';
import { STORAGE_KEY_GACHA_STATE } from '../../shared/storage-keys';
export function createGachaStoreInstance(deps: any) {
  const gachaStore = new GachaStore({
    store: Store,
    getCurrentContextFingerprint: deps.getCurrentContextFingerprint,
    storageKeyBase: STORAGE_KEY_GACHA_STATE,
  });
  return gachaStore;
}
