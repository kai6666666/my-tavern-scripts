// @ts-nocheck
/**
 * patch-latest-chat-sheet-cell-without-tracking.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createPatchLatestChatSheetCellWithoutTracking(deps: any) {
  const patchLatestChatSheetCellWithoutTracking = async (
    sheetKey: string,
    desiredSheet: unknown,
    rowIndex: number,
    colIndex: number,
    value: unknown,
  ): Promise<{ messageIndex: number; patchedKeys: string[] } | null> => {
    const chat = deps.getDbChatMessages();
    if (!chat) return null;
    for (let index = chat.length - 1; index >= 0; index--) {
      const msg = chat[index];
      if (!msg || msg.is_user) continue;
      const patchedKeys = deps.patchCrudSheetCellInMessage(msg, sheetKey, desiredSheet, rowIndex, colIndex, value);
      if (patchedKeys.length === 0) continue;
      await triggerSlash('savechat');
      return { messageIndex: index, patchedKeys };
    }
    return null;
  };
  return patchLatestChatSheetCellWithoutTracking;
}
