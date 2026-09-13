// @ts-nocheck
/**
 * get-inventory-metadata-scope-key.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetInventoryMetadataScopeKey(deps: any) {
  const getInventoryMetadataScopeKey = (tableKey: string, tableName: string): string => {
    return String(tableKey || tableName || 'inventory').trim() || 'inventory';
  };
  return getInventoryMetadataScopeKey;
}
