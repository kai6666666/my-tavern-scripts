// @ts-nocheck
/**
 * get-saved-table-order.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { STORAGE_KEY_TABLE_ORDER } from '../../shared/storage-keys';
import { Store } from '../../shared/storage/store';
export function createGetSavedTableOrder(deps: any) {
  const getSavedTableOrder = () => Store.get(STORAGE_KEY_TABLE_ORDER);
  return getSavedTableOrder;
}
