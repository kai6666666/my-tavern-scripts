// @ts-nocheck
/**
 * save-inventory-field-value.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createSaveInventoryFieldValue(deps: any) {
  const saveInventoryFieldValue = async (rowIndex: number, fieldKey: InventoryEditableField, nextValue: string) => {
    const context = deps.getInventoryDetailContext(rowIndex);
    if (!context) {
      if (window.toastr) window.toastr.warning('未找到物品数据');
      return;
    }

    if (fieldKey === 'acquiredAtLocation' || fieldKey === 'acquiredAt') {
      const currentRecord = deps.getInventoryMetadataForItem(context.rawData, context.item) || {
        acquiredAt: '',
        acquiredAtLocation: '',
      };
      const nextRecord: InventoryMetadataRecord = {
        ...currentRecord,
        [fieldKey]: String(nextValue || '').trim(),
      };
      await deps.saveInventoryMetadataRecord(rowIndex, nextRecord);
      return;
    }

    const trimmedValue = String(nextValue || '').trim();
    if (fieldKey === 'name' && !trimmedValue) {
      if (window.toastr) window.toastr.warning('物品名称不能为空');
      return;
    }

    const colIdx = deps.getInventoryFieldColumnIndex(context.colMap, fieldKey);
    if (colIdx < 0) {
      deps.warnTableTemplateIssue(`未找到“${deps.getInventoryFieldLabel(fieldKey)}”列`);
      return;
    }

    const nextRow = [...context.row];
    nextRow[colIdx] = nextValue;
    await deps.saveRowInstantly(context.item.tableKey, context.item.rowIndex, nextRow, {
      tableName: context.item.tableName,
      headers: context.headers,
      currentRow: context.row,
      sourceData: context.rawData,
      sheet: context.rawData?.[context.item.tableKey],
    });
    deps.reopenInventoryItemDetail(rowIndex);
  };
  return saveInventoryFieldValue;
}
