// @ts-nocheck
/**
 * apply-existing-row-cell-patches-via-crud.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createApplyExistingRowCellPatchesViaCrud(deps: any) {
  const applyExistingRowCellPatchesViaCrud = async (input: CrudExistingRowPatchInput): Promise<Set<number>> => {
    const changedColumns =
      input.changedColumns || deps.getCrudChangedColumns(input.headers, input.currentRow, input.nextRow);
    const writableColumns = new Set<number>(
      Array.from(changedColumns).filter(index => index > 0 && Boolean(input.headers[index])),
    );
    if (writableColumns.size === 0) return writableColumns;

    const columnAliasMap = input.columnAliasMap || deps.buildCrudColumnAliasMap(input.sheet);
    deps.assertCrudRequiredColumnsRepresented(input.tableName, input.headers, input.sheet);
    deps.assertCrudEnumConstraints(
      input.tableName,
      input.headers,
      input.nextRow,
      input.sheet,
      input.rowIndex,
      writableColumns,
      columnAliasMap,
    );
    deps.assertCrudLengthConstraints(
      input.tableName,
      input.headers,
      input.nextRow,
      input.sheet,
      input.rowIndex,
      writableColumns,
      columnAliasMap,
    );

    if (typeof input.api.updateRow === 'function') {
      const result = await input.api.updateRow({
        tableName: input.crudTableName,
        rowIndex: input.rowIndex + 1,
        data: deps.buildRowDataForCrud(
          input.headers,
          input.nextRow,
          writableColumns,
          input.sheet,
          columnAliasMap,
        ),
        ...deps.consumeCrudWriteOptions(input.batchContext),
      });
      if (result !== false && result !== -1) return writableColumns;

      if (input.batchContext) input.batchContext.remainingOperations += writableColumns.size;
      console.warn('[DICE]ACU updateRow failed, falling back to updateCell:', {
        tableName: input.tableName,
        rowIndex: input.rowIndex + 1,
        changedColumnCount: writableColumns.size,
      });
    }

    for (const colIndex of Array.from(writableColumns).sort((left, right) => left - right)) {
      const headerName = String(input.headers[colIndex] || '').trim();
      const rowIdPreparation = deps.prepareCrudRowIdForUpdateCell(input, colIndex);
      let result: unknown;
      try {
        result = await input.api.updateCell({
          tableName: input.crudTableName,
          rowIndex: input.rowIndex + 1,
          colIdentifier: headerName,
          value: deps.getCrudCellValueForWrite(
            input.headers,
            input.nextRow,
            colIndex,
            input.sheet,
            columnAliasMap,
          ),
          ...deps.consumeCrudWriteOptions(input.batchContext),
        });
      } catch (error) {
        deps.restoreCrudRowIdPreparation(rowIdPreparation);
        throw error;
      }
      if (result === false || result === -1) {
        deps.restoreCrudRowIdPreparation(rowIdPreparation);
        deps.assertCrudEnumConstraints(
          input.tableName,
          input.headers,
          input.nextRow,
          input.sheet,
          input.rowIndex,
          undefined,
          columnAliasMap,
        );
        deps.assertCrudLengthConstraints(
          input.tableName,
          input.headers,
          input.nextRow,
          input.sheet,
          input.rowIndex,
          undefined,
          columnAliasMap,
        );
        deps.assertCrudRequiredCellValues(
          input.tableName,
          input.headers,
          input.nextRow,
          input.sheet,
          input.rowIndex,
          columnAliasMap,
        );
        deps.assertCrudJsonFallbackAllowed(input.tableName, input.sheet);
        if (rowIdPreparation && (await deps.applyJsonCellFallbackForCrud(input, colIndex))) {
          continue;
        }
        console.warn('[DICE]ACU updateCell failed after row_id preparation:', {
          tableName: input.tableName,
          crudTableName: input.crudTableName,
          rowIndex: input.rowIndex + 1,
          column: headerName || `#${colIndex + 1}`,
          preparedRowId: rowIdPreparation?.rowId,
          preparedRowIdSource: rowIdPreparation?.source || '',
        });
        const rowIdDetail = rowIdPreparation
          ? `；已按 ${rowIdPreparation.source} 补齐 row_id=${String(rowIdPreparation.rowId)} 后数据库仍拒绝更新，通常表示该行没有成功载入 SQLite（例如同一行其它 NOT NULL/CHECK 字段仍不满足）`
          : '';
        throw new Error(
          `更新 "${input.tableName}" 第 ${input.rowIndex + 1} 行失败（列：${headerName || `#${colIndex + 1}`}）${rowIdDetail}`,
        );
      }
    }

    return writableColumns;
  };
  return applyExistingRowCellPatchesViaCrud;
}
