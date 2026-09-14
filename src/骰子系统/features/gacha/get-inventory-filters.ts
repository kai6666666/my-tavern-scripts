// @ts-nocheck
/**
 * get-inventory-filters.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { Store } from '../../shared/storage/store';
import { STORAGE_KEY_INVENTORY_FILTERS } from '../../shared/storage-keys';
import type { InventoryFilterState, InventoryTypeFilter, InventoryQualityFilter, InventorySortFilter } from './gacha-types';
export function createGetInventoryFilters(deps: any) {
  const getInventoryFilters = (): InventoryFilterState => {
    const target = deps.getInventoryPanelTarget();
    const storageKey = target === 'equipment' ? STORAGE_KEY_INVENTORY_FILTERS + '_equipment' : STORAGE_KEY_INVENTORY_FILTERS;
    const stored = Store.get(storageKey, {}) as Partial<InventoryFilterState>;
    return {
      search: String(stored.search || ''),
      type: deps.getINVENTORY_TYPE_OPTIONS().includes(stored.type as InventoryTypeFilter)
        ? (stored.type as InventoryTypeFilter)
        : '全部',
      quality: deps.getINVENTORY_QUALITY_OPTIONS().includes(stored.quality as InventoryQualityFilter)
        ? (stored.quality as InventoryQualityFilter)
        : '全部',
      sort: deps.getINVENTORY_SORT_OPTIONS().some(option => option.value === stored.sort)
        ? (stored.sort as InventorySortFilter)
        : 'default',
    };
  };
  return getInventoryFilters;
}
