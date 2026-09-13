// @ts-nocheck
/**
 * save-hidden-tables.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { Store } from '../../shared/storage/store';
import { STORAGE_KEY_HIDDEN_TABLES } from '../../shared/storage-keys';
export function createSaveHiddenTables(deps: any) {
  const saveHiddenTables = v => Store.set(STORAGE_KEY_HIDDEN_TABLES, v);
  return saveHiddenTables;
}
