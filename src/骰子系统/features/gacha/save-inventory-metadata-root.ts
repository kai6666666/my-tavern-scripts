// @ts-nocheck
/**
 * save-inventory-metadata-root.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createSaveInventoryMetadataRoot(deps: any) {
  const saveInventoryMetadataRoot = (root: InventoryMetadataRoot) => {
    const store = deps.getInventoryMetadataStore();
    store[deps.getInventoryMetadataContextKey()] = root;
    deps.saveInventoryMetadataStore(store);
  };
  return saveInventoryMetadataRoot;
}
