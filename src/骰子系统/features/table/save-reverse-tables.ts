// @ts-nocheck
/**
 * save-reverse-tables.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { Store } from '../../shared/storage/store';
import { STORAGE_KEY_REVERSE_TABLES } from '../../shared/storage-keys';
export function createSaveReverseTables(deps: any) {
  const saveReverseTables = v => Store.set(STORAGE_KEY_REVERSE_TABLES, v);
  return saveReverseTables;
}
