// @ts-nocheck
/**
 * parse-inventory-items.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createParseInventoryItems(deps: any) {
  const parseInventoryItems = (rawData, options: GachaRewardParseOptions = {}) => {
    const inventoryResult = deps.getInventoryResult(rawData, options);
    if (!inventoryResult?.data) {
      return {
        tableName: '物品表',
        tableKey: '',
        headers: [],
        items: [] as InventoryParsedItem[],
        colMap: deps.getInventoryColumnMap(inventoryResult),
      };
    }

    const headers = inventoryResult.data.headers || [];
    const rows = inventoryResult.data.rows || [];
    const colMap = deps.getInventoryColumnMap(inventoryResult, options);
    const tableName = inventoryResult.name || '物品表';
    if (options.requireNameColumn) deps.assertGachaRewardNameColumn(tableName, headers, colMap);

    const items = rows
      .map((row, rowIndex) => {
        const name = String(row[colMap.name] ?? '').trim();
        if (!name) return null;
        const rawRowIndex = Number((row as Record<string, unknown>)[deps.GACHA_CATALOG_RAW_ROW_INDEX_PROP]);
        const rawQuantity = String(row[colMap.quantity] ?? '1').trim();
        const quantity = Number.parseInt(rawQuantity, 10);
        const rowNewKey = `${tableName}-row-${rowIndex}`;
        const quantityChangedKey = `${tableName}-${rowIndex}-${colMap.quantity}`;
        const isNew = deps.getCurrentDiffMap().has(rowNewKey);
        const quantityChanged = colMap.quantity >= 0 && deps.getCurrentDiffMap().has(quantityChangedKey);
        return {
          name,
          type: String(row[colMap.type] ?? '道具').trim() || '道具',
          quantityText: rawQuantity || '1',
          quantity: Number.isFinite(quantity) ? quantity : 1,
          quality: String(row[colMap.quality] ?? '普通').trim() || '普通',
          tags: typeof colMap.tags === 'number' && colMap.tags >= 0 ? String(row[colMap.tags] ?? '').trim() : '',
          effect: typeof colMap.effect === 'number' && colMap.effect >= 0 ? String(row[colMap.effect] ?? '').trim() : '',
          description: String(row[colMap.description] ?? '').trim(),
          rowIndex: Number.isFinite(rawRowIndex) ? rawRowIndex : rowIndex,
          tableName,
          tableKey: inventoryResult.key || '',
          isNew,
          quantityChanged,
          isChanged: isNew || quantityChanged,
        };
      })
      .filter((item): item is InventoryParsedItem => Boolean(item));

    return { tableName, tableKey: inventoryResult.key || '', headers, items, colMap };
  };
  return parseInventoryItems;
}
