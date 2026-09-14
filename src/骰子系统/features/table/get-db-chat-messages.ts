// @ts-nocheck
/**
 * get-db-chat-messages.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetDbChatMessages(deps: any) {
  const getDbChatMessages = (): DbChatMessage[] | null => {
    const st = window.SillyTavern || window.parent?.SillyTavern;
    const rawChat = st?.chat;
    return Array.isArray(rawChat) ? (rawChat as DbChatMessage[]) : null;
  };
  return getDbChatMessages;
}
