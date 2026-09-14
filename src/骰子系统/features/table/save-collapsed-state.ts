// @ts-nocheck
/**
 * save-collapsed-state.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { Store } from '../../shared/storage/store';
import { STORAGE_KEY_IS_COLLAPSED } from '../../shared/storage-keys';
export function createSaveCollapsedState(deps: any) {
  const saveCollapsedState = v => Store.set(STORAGE_KEY_IS_COLLAPSED, v);
  return saveCollapsedState;
}
