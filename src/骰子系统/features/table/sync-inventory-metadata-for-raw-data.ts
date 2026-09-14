// @ts-nocheck
/**
 * sync-inventory-metadata-for-raw-data.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createSyncInventoryMetadataForRawData(deps: any) {
  const syncInventoryMetadataForRawData = rawData => {
    const inventoryResult = deps.getInventoryResult(rawData);
    if (!inventoryResult?.data) return;

    const parsed = deps.parseInventoryItems(rawData);
    const root = deps.getInventoryMetadataRoot(rawData, true);
    const scopeKey = deps.getInventoryMetadataScopeKey(parsed.tableKey, parsed.tableName);
    if (!root[scopeKey] || typeof root[scopeKey] !== 'object') {
      root[scopeKey] = {};
    }

    const scope = root[scopeKey];
    const existingNames = new Set(parsed.items.map(item => item.name).filter(Boolean));
    const { currentDetailLocation, currentTime } = deps.getInventoryGlobalContext(rawData);

    parsed.items.forEach(item => {
      if (scope[item.name]) return;
      scope[item.name] = {
        acquiredAt: currentTime,
        acquiredAtLocation: currentDetailLocation,
      };
    });

    Object.keys(scope).forEach(name => {
      if (!existingNames.has(name)) {
        delete scope[name];
      }
    });

    if (Object.keys(scope).length === 0) {
      delete root[scopeKey];
    }
    deps.saveInventoryMetadataRoot(root);
  };
  return syncInventoryMetadataForRawData;
}
