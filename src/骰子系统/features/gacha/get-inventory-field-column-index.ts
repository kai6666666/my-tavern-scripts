// @ts-nocheck
/**
 * get-inventory-field-column-index.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetInventoryFieldColumnIndex(deps: any) {
  const getInventoryFieldColumnIndex = (
    colMap: ReturnType<typeof deps.getInventoryColumnMap>,
    fieldKey: Exclude<InventoryEditableField, 'acquiredAtLocation' | 'acquiredAt'>,
  ): number => {
    const indexMap: Record<Exclude<InventoryEditableField, 'acquiredAtLocation' | 'acquiredAt'>, number> = {
      name: colMap.name,
      type: colMap.type,
      quantity: colMap.quantity,
      quality: colMap.quality,
      description: colMap.description,
    };
    return indexMap[fieldKey];
  };
  return getInventoryFieldColumnIndex;
}
