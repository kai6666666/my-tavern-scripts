// @ts-nocheck
/**
 * get-table-heights.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { STORAGE_KEY_TABLE_HEIGHTS } from '../../shared/storage-keys';
import { Store } from '../../shared/storage/store';
export function createGetTableHeights(deps: any) {
  const getTableHeights = () => Store.get(STORAGE_KEY_TABLE_HEIGHTS, {});
  return getTableHeights;
}
