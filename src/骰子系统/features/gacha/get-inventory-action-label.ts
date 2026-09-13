// @ts-nocheck
/**
 * get-inventory-action-label.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetInventoryActionLabel(deps: any) {
  const getInventoryActionLabel = itemType => {
    if (itemType === '任务物品') return '检查';
    if (itemType === '材料') return '查看';
    return '使用';
  };
  return getInventoryActionLabel;
}
