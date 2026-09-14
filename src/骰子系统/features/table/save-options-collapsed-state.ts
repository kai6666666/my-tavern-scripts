// @ts-nocheck
/**
 * save-options-collapsed-state.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { Store } from '../../shared/storage/store';
import { STORAGE_KEY_OPTIONS_COLLAPSED } from '../../shared/storage-keys';
export function createSaveOptionsCollapsedState(deps: any) {
  const saveOptionsCollapsedState = v => Store.set(STORAGE_KEY_OPTIONS_COLLAPSED, v);
  return saveOptionsCollapsedState;
}
