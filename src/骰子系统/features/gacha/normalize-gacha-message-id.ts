// @ts-nocheck
/**
 * normalize-gacha-message-id.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createNormalizeGachaMessageId(deps: any) {
  const normalizeGachaMessageId = (messageId?: unknown): string => {
    if (typeof messageId === 'string' || typeof messageId === 'number') {
      return String(messageId).trim();
    }
    if (!messageId || typeof messageId !== 'object') return '';
    const record = messageId as Record<string, unknown>;
    const candidateKeys = ['messageId', 'message_id', 'mesid', 'id', 'index'];
    for (const key of candidateKeys) {
      const value = record[key];
      if (typeof value === 'string' || typeof value === 'number') {
        const normalized = String(value).trim();
        if (normalized) return normalized;
      }
    }
    return '';
  };
  return normalizeGachaMessageId;
}
