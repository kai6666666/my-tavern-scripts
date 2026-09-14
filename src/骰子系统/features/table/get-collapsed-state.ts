// @ts-nocheck
/**
 * get-collapsed-state.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { STORAGE_KEY_IS_COLLAPSED } from '../../shared/storage-keys';
import { Store } from '../../shared/storage/store';
export function createGetCollapsedState(deps: any) {
  const getCollapsedState = () => Store.get(STORAGE_KEY_IS_COLLAPSED, false);
  return getCollapsedState;
}
