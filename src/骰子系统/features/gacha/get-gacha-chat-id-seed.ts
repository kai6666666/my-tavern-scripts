// @ts-nocheck
/**
 * get-gacha-chat-id-seed.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetGachaChatIdSeed(deps: any) {
  const getGachaChatIdSeed = (): string => {
    const st = (window.SillyTavern || window.parent?.SillyTavern) as
      | { getCurrentChatId?: () => string; chatId?: string }
      | undefined;
    try {
      const chatId = typeof st?.getCurrentChatId === 'function' ? st.getCurrentChatId() : st?.chatId;
      return String(chatId || 'unknown_chat');
    } catch {
      return 'unknown_chat';
    }
  };
  return getGachaChatIdSeed;
}
