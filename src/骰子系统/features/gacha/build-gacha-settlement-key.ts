// @ts-nocheck
/**
 * build-gacha-settlement-key.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createBuildGachaSettlementKey(deps: any) {
  const buildGachaSettlementKey = (messageId: string, messageText: string): string => {
    if (messageId) return `id:${messageId}`;
    const normalizedText = deps.stripSystemInjectedContent(messageText);
    if (!normalizedText) return `empty:${Math.floor(Date.now() / 2000)}`;
    return `text:${deps.countUnicodeCharacters(normalizedText)}:${normalizedText.slice(0, 80)}:${normalizedText.slice(-80)}`;
  };
  return buildGachaSettlementKey;
}
