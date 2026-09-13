// @ts-nocheck
/**
 * get-inventory-detail-context.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetInventoryDetailContext(deps: any) {
  const getInventoryDetailContext = (rowIndex: number, options?: { preferLatest?: boolean }) => {
    const rawData = options?.preferLatest
      ? deps.getTableData({ silent: true }) || deps.cloneRuntimeDataValue(deps.getCachedRawData())
      : deps.getCachedRawData() || deps.getTableData();
    const parsed = deps.parseInventoryItems(rawData);
    const item = parsed.items.find(candidate => candidate.rowIndex === rowIndex) || null;
    if (!rawData || !item || !item.tableKey) return null;
    const table = rawData[item.tableKey];
    const headers = Array.isArray(table?.content?.[0]) ? table.content[0] : parsed.headers;
    const row = Array.isArray(table?.content?.[item.rowIndex + 1]) ? table.content[item.rowIndex + 1] : null;
    if (!row) return null;
    return {
      rawData,
      item,
      headers,
      row,
      colMap: parsed.colMap,
    };
  };
  return getInventoryDetailContext;
}
