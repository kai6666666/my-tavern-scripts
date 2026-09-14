// @ts-nocheck
/**
 * get-inventory-metadata-root.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetInventoryMetadataRoot(deps: any) {
  const getInventoryMetadataRoot = (rawData, createIfMissing = false): InventoryMetadataRoot => {
    const store = deps.getInventoryMetadataStore();
    const contextKey = deps.getInventoryMetadataContextKey();
    const storedRoot = store[contextKey];
    if (storedRoot && typeof storedRoot === 'object') return storedRoot;

    const legacyRoot = deps.getLegacyInventoryMetadataRoot(rawData);
    if (legacyRoot) {
      store[contextKey] = legacyRoot;
      deps.saveInventoryMetadataStore(store);
      return legacyRoot;
    }

    if (!createIfMissing) return {};
    const createdRoot: InventoryMetadataRoot = {};
    store[contextKey] = createdRoot;
    deps.saveInventoryMetadataStore(store);
    return createdRoot;
  };
  return getInventoryMetadataRoot;
}
