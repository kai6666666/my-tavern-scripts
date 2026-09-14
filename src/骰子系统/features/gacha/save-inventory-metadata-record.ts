// @ts-nocheck
/**
 * save-inventory-metadata-record.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createSaveInventoryMetadataRecord(deps: any) {
  const saveInventoryMetadataRecord = async (rowIndex: number, nextRecord: InventoryMetadataRecord) => {
    const context = deps.getInventoryDetailContext(rowIndex);
    if (!context) {
      if (window.toastr) window.toastr.warning('未找到物品数据');
      return;
    }
    deps.setInventoryMetadataForItem(context.rawData, context.item, nextRecord);
    deps.reopenInventoryItemDetail(rowIndex);
  };
  return saveInventoryMetadataRecord;
}
