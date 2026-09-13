// @ts-nocheck
/**
 * find-latest-db-message-index.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createFindLatestDbMessageIndex(deps: any) {
  const findLatestDbMessageIndex = (includeUser = false): number => {
    const chat = deps.getDbChatMessages();
    if (!chat) return -1;
    for (let i = chat.length - 1; i >= 0; i--) {
      const msg = chat[i];
      if (!includeUser && msg?.is_user) continue;
      if (deps.hasDbPayload(msg)) return i;
    }
    return -1;
  };
  return findLatestDbMessageIndex;
}
