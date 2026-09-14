// @ts-nocheck
/**
 * set-inventory-metadata-for-item.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createSetInventoryMetadataForItem(deps: any) {
  const setInventoryMetadataForItem = (
    rawData,
    item: Pick<InventoryParsedItem, 'tableKey' | 'tableName' | 'name'>,
    record: InventoryMetadataRecord,
  ) => {
    const root = deps.getInventoryMetadataRoot(rawData, true);
    const scopeKey = deps.getInventoryMetadataScopeKey(item.tableKey, item.tableName);
    if (!root[scopeKey] || typeof root[scopeKey] !== 'object') {
      root[scopeKey] = {};
    }
    root[scopeKey][item.name] = {
      acquiredAt: String(record.acquiredAt || '').trim(),
      acquiredAtLocation: String(record.acquiredAtLocation || '').trim(),
    };
    deps.saveInventoryMetadataRoot(root);
  };
  return setInventoryMetadataForItem;
}
