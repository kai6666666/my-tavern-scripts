// @ts-nocheck
/**
 * save-inventory-filters-collapsed-state.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { Store } from '../../shared/storage/store';
import { STORAGE_KEY_INVENTORY_FILTERS_COLLAPSED } from '../../shared/storage-keys';
export function createSaveInventoryFiltersCollapsedState(deps: any) {
  const saveInventoryFiltersCollapsedState = (collapsed: boolean) =>
    Store.set(STORAGE_KEY_INVENTORY_FILTERS_COLLAPSED, collapsed);
  return saveInventoryFiltersCollapsedState;
}
