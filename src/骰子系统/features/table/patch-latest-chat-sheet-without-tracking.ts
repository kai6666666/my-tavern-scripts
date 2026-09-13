// @ts-nocheck
/**
 * patch-latest-chat-sheet-without-tracking.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createPatchLatestChatSheetWithoutTracking(deps: any) {
  const patchLatestChatSheetWithoutTracking = async (
    sheetKey: string,
    desiredSheet: unknown,
  ): Promise<{ messageIndex: number; patchedKeys: string[] } | null> => {
    const chat = deps.getDbChatMessages();
    if (!chat) return null;
    for (let index = chat.length - 1; index >= 0; index--) {
      const msg = chat[index];
      if (!msg || msg.is_user) continue;
      const patchedKeys = deps.patchCrudSheetInMessage(msg, sheetKey, desiredSheet);
      if (patchedKeys.length === 0) continue;
      await triggerSlash('savechat');
      return { messageIndex: index, patchedKeys };
    }
    return null;
  };
  return patchLatestChatSheetWithoutTracking;
}
