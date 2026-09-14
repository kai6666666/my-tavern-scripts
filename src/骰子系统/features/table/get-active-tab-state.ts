// @ts-nocheck
/**
 * get-active-tab-state.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { STORAGE_KEY_ACTIVE_TAB } from '../../shared/storage-keys';
import { Store } from '../../shared/storage/store';
export function createGetActiveTabState(deps: any) {
  const getActiveTabState = () => Store.get(STORAGE_KEY_ACTIVE_TAB);
  return getActiveTabState;
}
