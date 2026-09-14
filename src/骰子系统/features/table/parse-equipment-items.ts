// @ts-nocheck
/**
 * parse-equipment-items.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createParseEquipmentItems(deps: any) {
  const parseEquipmentItems = (rawData, options: GachaRewardParseOptions = {}) => {
    const equipmentResult = deps.getEquipmentResult(rawData, options);
    if (!equipmentResult?.data) {
      return {
        tableName: '装备表',
        tableKey: '',
        headers: [],
        items: [] as InventoryParsedItem[],
        colMap: deps.getEquipmentColumnMap(equipmentResult),
      };
    }

    const headers = equipmentResult.data.headers || [];
    const rows = equipmentResult.data.rows || [];
    const colMap = deps.getEquipmentColumnMap(equipmentResult, options);
    const tableName = equipmentResult.name || '装备表';
    if (options.requireNameColumn) deps.assertGachaRewardNameColumn(tableName, headers, colMap);

    const items = rows
      .map((row, rowIndex) => {
        const name = String(row[colMap.name] ?? '').trim();
        if (!name) return null;
        const rawRowIndex = Number((row as Record<string, unknown>)[deps.GACHA_CATALOG_RAW_ROW_INDEX_PROP]);
        const rawQuantity = colMap.quantity >= 0 ? String(row[colMap.quantity] ?? '1').trim() : '1';
        const quantity = Number.parseInt(rawQuantity, 10);
        const rowNewKey = `${tableName}-row-${rowIndex}`;
        const statusChangedKey =
          typeof colMap.status === 'number' && colMap.status >= 0 ? `${tableName}-${rowIndex}-${colMap.status}` : '';
        const isNew = deps.getCurrentDiffMap().has(rowNewKey);
        const quantityChanged =
          (colMap.quantity >= 0 && deps.getCurrentDiffMap().has(`${tableName}-${rowIndex}-${colMap.quantity}`)) ||
          (statusChangedKey ? deps.getCurrentDiffMap().has(statusChangedKey) : false);
        return {
          name,
          type: String(row[colMap.type] ?? '装备').trim() || '装备',
          quantityText: rawQuantity || '1',
          quantity: Number.isFinite(quantity) ? quantity : 1,
          quality: String(row[colMap.quality] ?? '普通').trim() || '普通',
          tags: typeof colMap.tags === 'number' && colMap.tags >= 0 ? String(row[colMap.tags] ?? '').trim() : '',
          effect: typeof colMap.effect === 'number' && colMap.effect >= 0 ? String(row[colMap.effect] ?? '').trim() : '',
          description: String(row[colMap.description] ?? '').trim(),
          rowIndex: Number.isFinite(rawRowIndex) ? rawRowIndex : rowIndex,
          tableName,
          tableKey: equipmentResult.key || '',
          isNew,
          quantityChanged,
          isChanged: isNew || quantityChanged,
        };
      })
      .filter((item): item is InventoryParsedItem => Boolean(item));

    return { tableName, tableKey: equipmentResult.key || '', headers, items, colMap };
  };
  return parseEquipmentItems;
}
