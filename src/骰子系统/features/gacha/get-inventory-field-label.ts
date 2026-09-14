// @ts-nocheck
/**
 * get-inventory-field-label.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetInventoryFieldLabel(deps: any) {
  const getInventoryFieldLabel = (fieldKey: InventoryEditableField): string => {
    const labelMap: Record<InventoryEditableField, string> = {
      name: '名称',
      type: '类型',
      quantity: '数量',
      quality: '品质',
      description: '描述',
      acquiredAtLocation: '获得地',
      acquiredAt: '获取时间',
    };
    return labelMap[fieldKey];
  };
  return getInventoryFieldLabel;
}
