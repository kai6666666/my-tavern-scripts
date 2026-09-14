// @ts-nocheck
/**
 * patch-crud-sheet-cell-in-message.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createPatchCrudSheetCellInMessage(deps: any) {
  const patchCrudSheetCellInMessage = (
    msg: DbChatMessage,
    sheetKey: string,
    desiredSheet: unknown,
    rowIndex: number,
    colIndex: number,
    value: unknown,
  ): string[] => {
    const patchedKeys: string[] = [];
    const rememberPatchedKey = (key: string | null): void => {
      if (key && !patchedKeys.includes(key)) patchedKeys.push(key);
    };

    const isolatedData = deps.parseIsolatedData(msg.TavernDB_ACU_IsolatedData);
    const isolationKey = deps.resolveIsolationKey(msg, isolatedData);
    if (isolatedData && isolationKey !== null) {
      const tagData = deps.asDiffRecord(isolatedData[isolationKey]);
      const independentData = deps.asDiffRecord(tagData?.independentData);
      rememberPatchedKey(
        deps.patchCrudSheetCellInRecord(independentData, sheetKey, desiredSheet, rowIndex, colIndex, value),
      );
      if (patchedKeys.length > 0) msg.TavernDB_ACU_IsolatedData = isolatedData;
    }

    rememberPatchedKey(
      deps.patchCrudSheetCellInRecord(msg.TavernDB_ACU_IndependentData, sheetKey, desiredSheet, rowIndex, colIndex, value),
    );
    rememberPatchedKey(
      deps.patchCrudSheetCellInRecord(msg.TavernDB_ACU_Data, sheetKey, desiredSheet, rowIndex, colIndex, value),
    );
    rememberPatchedKey(
      deps.patchCrudSheetCellInRecord(msg.TavernDB_ACU_SummaryData, sheetKey, desiredSheet, rowIndex, colIndex, value),
    );

    return patchedKeys;
  };
  return patchCrudSheetCellInMessage;
}
