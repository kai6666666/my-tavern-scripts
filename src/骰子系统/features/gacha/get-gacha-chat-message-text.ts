// @ts-nocheck
/**
 * get-gacha-chat-message-text.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetGachaChatMessageText(deps: any) {
  const getGachaChatMessageText = (messageId?: unknown): string => {
    const chat = deps.getDbChatMessages();
    if (!chat || chat.length === 0) return '';
    const normalizedId = deps.normalizeGachaMessageId(messageId);
    const readMessageText = (message: DbChatMessage | null | undefined): string => {
      if (!message) return '';
      const candidates = [message.mes, message.message, message.text, message.content];
      for (const value of candidates) {
        if (typeof value === 'string' && value.trim()) return value;
      }
      return '';
    };

    if (normalizedId) {
      const matched = chat.find(message => {
        const candidates = [message.id, message.mesid, message.message_id, message.swipes_id];
        return candidates.some(value => String(value ?? '').trim() === normalizedId);
      });
      const matchedText = readMessageText(matched);
      if (matchedText) return matchedText;

      const numericIndex = Number.parseInt(normalizedId, 10);
      if (Number.isFinite(numericIndex) && numericIndex >= 0 && numericIndex < chat.length) {
        const indexedText = readMessageText(chat[numericIndex]);
        if (indexedText) return indexedText;
      }
    }

    for (let index = chat.length - 1; index >= 0; index--) {
      const message = chat[index];
      if (message?.is_user) {
        const text = readMessageText(message);
        if (text) return text;
      }
    }
    return '';
  };
  return getGachaChatMessageText;
}
