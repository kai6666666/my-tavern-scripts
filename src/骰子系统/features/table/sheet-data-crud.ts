// @ts-nocheck
/**
 * sheet-data-crud.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createApplySheetDataViaCrud(deps: any) {
  const applySheetDataViaCrud = async (api, sheetKey: string, desiredSheet, latestSheet) => {
    if (!desiredSheet?.name || !Array.isArray(desiredSheet?.content)) {
      throw new Error(`修改表不存在或格式非法：${sheetKey}`);
    }
    if (!latestSheet?.name || !Array.isArray(latestSheet?.content)) {
      throw new Error(`表 "${desiredSheet.name || sheetKey}" 不存在，整表新增/恢复不支持快捷保存。`);
    }
    if (!deps.sameHeaders(desiredSheet, latestSheet)) {
      throw new Error(`表 "${desiredSheet.name || sheetKey}" 的结构已变化，结构级变更只标注，不支持快捷保存。`);
    }

    const tableName = desiredSheet.name;
    const crudTableName = deps.getCrudTableIdentifier(desiredSheet, tableName);
    const headers = deps.getSheetHeaders(desiredSheet);
    const desiredRows = deps.getSheetRows(desiredSheet);
    const oldRows = deps.getSheetRows(latestSheet);
    const columnAliasMap = deps.buildCrudColumnAliasMap(desiredSheet);
    deps.assertCrudRequiredColumnsRepresented(tableName, headers, desiredSheet);

    if (desiredRows.length > oldRows.length) {
      deps.assertAppendOnlyRows(oldRows, desiredRows);
    }

    let workingRows = oldRows.map(row => [...row]);
    if (desiredRows.length < oldRows.length) {
      const deleteIndices = deps.findDeletionIndicesForCrud(oldRows, desiredRows);
      if (!deleteIndices) {
        throw new Error(`表 "${tableName}" 的行删除无法安全定位，已取消快捷保存。`);
      }
      for (const rowIndex of deleteIndices.sort((left, right) => right - left)) {
        const result = await api.deleteRow({ tableName: crudTableName, rowIndex: rowIndex + 1, skipNotify: true });
        if (result === false) throw new Error(`删除 "${tableName}" 第 ${rowIndex + 1} 行失败`);
        workingRows.splice(rowIndex, 1);
      }
    }

    if (desiredRows.length > workingRows.length) {
      for (let index = workingRows.length; index < desiredRows.length; index++) {
        deps.assertCrudInsertRequiredCells(tableName, headers, desiredRows[index], desiredSheet, index);
        deps.assertCrudEnumConstraints(
          tableName,
          headers,
          desiredRows[index],
          desiredSheet,
          index,
          undefined,
          columnAliasMap,
        );
        deps.assertCrudLengthConstraints(
          tableName,
          headers,
          desiredRows[index],
          desiredSheet,
          index,
          undefined,
          columnAliasMap,
        );
        const rowData = deps.buildRowDataForCrud(headers, desiredRows[index], undefined, desiredSheet, columnAliasMap);
        const result = await api.insertRow({ tableName: crudTableName, data: rowData, skipNotify: true });
        if (result === false || result === -1) {
          throw new Error(`向 "${tableName}" 追加新行失败：数据库拒绝写入，请检查表结构、必填列和枚举约束。`);
        }
        workingRows.push([...desiredRows[index]]);
      }
    }

    for (let rowIndex = 0; rowIndex < desiredRows.length; rowIndex++) {
      const desiredRow = desiredRows[rowIndex] || [];
      const currentRow = workingRows[rowIndex] || [];
      if (deps.sameRow(currentRow, desiredRow)) continue;

      const changedColumns = deps.getCrudChangedColumns(headers, currentRow, desiredRow);
      await deps.applyExistingRowCellPatchesViaCrud({
        api,
        sheetKey,
        tableName,
        crudTableName,
        headers,
        currentRow,
        nextRow: desiredRow,
        sheet: desiredSheet,
        rowIndex,
        changedColumns,
        columnAliasMap,
      });
      workingRows[rowIndex] = [...desiredRow];
    }
  };
  return applySheetDataViaCrud;
}
