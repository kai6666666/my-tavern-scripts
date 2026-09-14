// @ts-nocheck
/**
 * get-inventory-default-meta-record.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetInventoryDefaultMetaRecord(deps: any) {
  const getInventoryDefaultMetaRecord = (rawData): InventoryMetadataRecord => {
    const globalContext = deps.getInventoryGlobalContext(rawData);
    const fallbackTime = new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-');
    return {
      acquiredAt: String(globalContext.currentTime || fallbackTime).trim(),
      acquiredAtLocation: String(globalContext.currentDetailLocation || '').trim() || '未知',
    };
  };
  return getInventoryDefaultMetaRecord;
}
