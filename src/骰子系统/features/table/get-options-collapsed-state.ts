// @ts-nocheck
/**
 * get-options-collapsed-state.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { STORAGE_KEY_OPTIONS_COLLAPSED } from '../../shared/storage-keys';
import { Store } from '../../shared/storage/store';
export function createGetOptionsCollapsedState(deps: any) {
  const getOptionsCollapsedState = () => Store.get(STORAGE_KEY_OPTIONS_COLLAPSED, false);
  return getOptionsCollapsedState;
}
