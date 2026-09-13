// @ts-nocheck
/**
 * build-gacha-inventory-meta-record.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createBuildGachaInventoryMetaRecord(deps: any) {
  const buildGachaInventoryMetaRecord = (
    rawData,
    item: Pick<InventoryParsedItem, 'tableKey' | 'tableName' | 'name'>,
  ): InventoryMetadataRecord => {
    const current = deps.getInventoryMetadataForItem(rawData, item);
    const defaults = current || deps.getInventoryDefaultMetaRecord(rawData);
    return {
      acquiredAt: defaults.acquiredAt,
      acquiredAtLocation: defaults.acquiredAtLocation,
    };
  };
  return buildGachaInventoryMetaRecord;
}
