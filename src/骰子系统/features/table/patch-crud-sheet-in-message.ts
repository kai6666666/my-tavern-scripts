// @ts-nocheck
/**
 * patch-crud-sheet-in-message.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createPatchCrudSheetInMessage(deps: any) {
  const patchCrudSheetInMessage = (msg: DbChatMessage, sheetKey: string, desiredSheet: unknown): string[] => {
    const patchedKeys: string[] = [];
    const rememberPatchedKey = (key: string | null): void => {
      if (key && !patchedKeys.includes(key)) patchedKeys.push(key);
    };

    const isolatedData = deps.parseIsolatedData(msg.TavernDB_ACU_IsolatedData);
    const isolationKey = deps.resolveIsolationKey(msg, isolatedData);
    if (isolatedData && isolationKey !== null) {
      const tagData = deps.asDiffRecord(isolatedData[isolationKey]);
      const independentData = deps.asDiffRecord(tagData?.independentData);
      rememberPatchedKey(deps.patchCrudSheetInRecord(independentData, sheetKey, desiredSheet));
      if (patchedKeys.length > 0) msg.TavernDB_ACU_IsolatedData = isolatedData;
    }

    rememberPatchedKey(deps.patchCrudSheetInRecord(msg.TavernDB_ACU_IndependentData, sheetKey, desiredSheet));
    rememberPatchedKey(deps.patchCrudSheetInRecord(msg.TavernDB_ACU_Data, sheetKey, desiredSheet));
    rememberPatchedKey(deps.patchCrudSheetInRecord(msg.TavernDB_ACU_SummaryData, sheetKey, desiredSheet));

    return patchedKeys;
  };
  return patchCrudSheetInMessage;
}
