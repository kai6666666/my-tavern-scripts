// @ts-nocheck
/**
 * get-hidden-tables.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { STORAGE_KEY_HIDDEN_TABLES } from '../../shared/storage-keys';
import { Store } from '../../shared/storage/store';
export function createGetHiddenTables(deps: any) {
  const getHiddenTables = () => Store.get(STORAGE_KEY_HIDDEN_TABLES, []);
  return getHiddenTables;
}
