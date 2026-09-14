// @ts-nocheck
/**
 * get-inventory-metadata-store.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { Store } from '../../shared/storage/store';
import { STORAGE_KEY_INVENTORY_METADATA } from '../../shared/storage-keys';
export function createGetInventoryMetadataStore(deps: any) {
  const getInventoryMetadataStore = (): InventoryMetadataStore => {
    const stored = Store.get(STORAGE_KEY_INVENTORY_METADATA, {});
    return stored && typeof stored === 'object' ? (stored as InventoryMetadataStore) : {};
  };
  return getInventoryMetadataStore;
}
