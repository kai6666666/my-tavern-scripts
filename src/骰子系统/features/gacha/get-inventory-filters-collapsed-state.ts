// @ts-nocheck
/**
 * get-inventory-filters-collapsed-state.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { STORAGE_KEY_INVENTORY_FILTERS_COLLAPSED } from '../../shared/storage-keys';
import { Store } from '../../shared/storage/store';
export function createGetInventoryFiltersCollapsedState(deps: any) {
  const getInventoryFiltersCollapsedState = () => Store.get(STORAGE_KEY_INVENTORY_FILTERS_COLLAPSED, true);
  return getInventoryFiltersCollapsedState;
}
