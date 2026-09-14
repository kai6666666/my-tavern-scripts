// @ts-nocheck
/**
 * save-active-tab-state.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { Store } from '../../shared/storage/store';
import { STORAGE_KEY_ACTIVE_TAB } from '../../shared/storage-keys';
export function createSaveActiveTabState(deps: any) {
  const saveActiveTabState = v => Store.set(STORAGE_KEY_ACTIVE_TAB, v);
  return saveActiveTabState;
}
