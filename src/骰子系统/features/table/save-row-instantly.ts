// @ts-nocheck
/**
 * save-row-instantly.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { showActionableErrorToast } from '../../shared/actionable-error-toast';
export function createSaveRowInstantly(deps: any) {
  const saveRowInstantly = async (
    tableKey: string,
    rowIndex: number,
    newRowData: unknown[],
    context?: RuntimeRowSaveContext,
  ): Promise<void> => {
    try {
      await deps.runInSaveQueue(async () => {
        const api = deps.assertRuntimeCrudApi();
        const source = deps.resolveRuntimeMutationSource(tableKey);
        const sourceData = context?.sourceData || source?.data;
        const entry = source?.entry;
        const tableName = deps.normalizeDiffText(context?.tableName) || deps.normalizeDiffText(entry?.sheet?.name);
        const sheetForMetadata = context?.sheet || entry?.sheet;
        const headers = Array.isArray(context?.headers) ? context.headers : deps.getSheetHeaders(entry?.sheet);
        const currentRow = Array.isArray(context?.currentRow)
          ? context.currentRow
          : deps.getDiffDataRow(entry?.sheet, rowIndex);

        if (!tableName) {
          throw new Error(`表格 "${tableKey}" 不存在`);
        }
        if (!Array.isArray(headers) || headers.length === 0) {
          throw new Error(`表格 "${tableName}" 表头为空`);
        }
        if (!currentRow) {
          throw new Error(`表格 "${tableName}" 第 ${rowIndex + 1} 行不存在`);
        }

        const crudTableName = deps.getCrudTableIdentifier(sheetForMetadata, tableName);
        const nextRow = [...newRowData];
        const columnAliasMap = deps.buildCrudColumnAliasMap(sheetForMetadata);
        const changedColumns = deps.getCrudChangedColumns(headers, currentRow, nextRow);
        const appliedColumns = await deps.applyExistingRowCellPatchesViaCrud({
          api,
          sheetKey: tableKey,
          tableName,
          crudTableName,
          headers,
          currentRow,
          nextRow,
          sheet: sheetForMetadata,
          rowIndex,
          changedColumns,
          columnAliasMap,
        });
        if (appliedColumns.size === 0) return;

        const fallbackData = sourceData ? deps.cloneRuntimeDataValue(sourceData) : null;
        if (fallbackData) {
          const fallbackEntry =
            deps.findRuntimeSheetEntryForMutation(fallbackData, entry?.key || tableKey) ||
            deps.findRuntimeSheetEntryForMutation(fallbackData, tableKey);
          if (fallbackEntry?.sheet?.content?.[rowIndex + 1]) {
            fallbackEntry.sheet.content[rowIndex + 1] = [...nextRow];
          }
          deps.updateRuntimeDataCacheAfterCrud(api, fallbackData, entry?.key || tableKey);
        } else {
          deps.setCachedRawData(deps.getTableData({ silent: true }) || deps.getCachedRawData());
          api._notifyTableUpdate?.();
        }

        const snapshot = deps.loadSnapshot();
        const snapshotEntry = snapshot ? deps.findDiffSnapshotEntry(snapshot, tableKey, sheetForMetadata) : null;
        if (deps.setDiffDataRow(snapshotEntry?.sheet, rowIndex, nextRow)) {
          deps.saveSnapshot(snapshot);
        }
      });
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : String(e);
      console.error('[DICE]ACU saveRowInstantly error:', deps.getRuntimeErrorLogPayload(e));
      showActionableErrorToast(`保存失败: ${errorMsg}`, { title: '保存失败', suggestion: 'save' });
      throw e;
    }
  };
  return saveRowInstantly;
}
