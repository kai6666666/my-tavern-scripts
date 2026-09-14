// @ts-nocheck
/**
 * normalize-check-suggestion-side-shorthand.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createNormalizeCheckSuggestionSideShorthand(deps: any) {
  const normalizeCheckSuggestionSideShorthand = (text: string): string => {
    const trimmed = String(text || '').trim();
    const match = trimmed.match(/^([^=\s]+)[.。:：/]([^=\s]+)$/);
    if (!match) return trimmed;
    return `${match[1]} ${match[2]}`;
  };
  return normalizeCheckSuggestionSideShorthand;
}
