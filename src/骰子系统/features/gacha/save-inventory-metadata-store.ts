// @ts-nocheck
/**
 * save-inventory-metadata-store.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { Store } from '../../shared/storage/store';
import { STORAGE_KEY_INVENTORY_METADATA } from '../../shared/storage-keys';
export function createSaveInventoryMetadataStore(deps: any) {
  const saveInventoryMetadataStore = (store: InventoryMetadataStore) => {
    Store.set(STORAGE_KEY_INVENTORY_METADATA, store);
  };
  return saveInventoryMetadataStore;
}
