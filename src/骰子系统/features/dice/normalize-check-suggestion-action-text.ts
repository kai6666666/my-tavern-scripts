// @ts-nocheck
/**
 * normalize-check-suggestion-action-text.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createNormalizeCheckSuggestionActionText(deps: any) {
  const normalizeCheckSuggestionActionText = (displayText: string): string => {
    const text = String(displayText || '').trim();
    if (!text) return '';
    return `${text}${/[。！？!?…]$/.test(text) ? '' : '。'}`;
  };
  return normalizeCheckSuggestionActionText;
}
