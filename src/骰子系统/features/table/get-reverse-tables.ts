// @ts-nocheck
/**
 * get-reverse-tables.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { STORAGE_KEY_REVERSE_TABLES } from '../../shared/storage-keys';
import { Store } from '../../shared/storage/store';
export function createGetReverseTables(deps: any) {
  const getReverseTables = () => Store.get(STORAGE_KEY_REVERSE_TABLES, []);
  return getReverseTables;
}
