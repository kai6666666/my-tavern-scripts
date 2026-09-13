// @ts-nocheck
/**
 * save-inventory-filters.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { Store } from '../../shared/storage/store';
import { STORAGE_KEY_INVENTORY_FILTERS } from '../../shared/storage-keys';
export function createSaveInventoryFilters(deps: any) {
  const saveInventoryFilters = (filters: Partial<InventoryFilterState>) => {
    Store.set(STORAGE_KEY_INVENTORY_FILTERS, { ...deps.getInventoryFilters(), ...filters });
  };
  return saveInventoryFilters;
}
