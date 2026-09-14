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
      try {
        await triggerSlash('savechat');
      } catch (saveError) {
        try {
          const helper = (window as any).TavernHelper;
          if (helper && typeof helper.triggerSlash === 'function') {
            await helper.triggerSlash('/savechat');
          } else {
            console.warn('[DICE]ACU savechat 未找到可用通道（已忽略）:', saveError);
          }
        } catch (fallbackError) {
          console.warn('[DICE]ACU savechat 回退失败（已忽略）:', fallbackError);
        }
      }
      return { messageIndex: index, patchedKeys };
    }
    return null;
  };
  return patchLatestChatSheetWithoutTracking;
}
