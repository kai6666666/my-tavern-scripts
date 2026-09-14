// @ts-nocheck
/**
 * reopen-inventory-item-detail.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createReopenInventoryItemDetail(deps: any) {
  const reopenInventoryItemDetail = (rowIndex: number) => {
    $('.acu-inventory-detail-overlay').remove();
    deps.showInventoryItemDetail(rowIndex);
  };
  return reopenInventoryItemDetail;
}
