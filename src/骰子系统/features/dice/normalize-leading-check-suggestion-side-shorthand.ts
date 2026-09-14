// @ts-nocheck
/**
 * normalize-leading-check-suggestion-side-shorthand.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createNormalizeLeadingCheckSuggestionSideShorthand(deps: any) {
  const normalizeLeadingCheckSuggestionSideShorthand = (text: string): string => {
    const parts = String(text || '')
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    if (!parts.length) return '';
    return [deps.normalizeCheckSuggestionSideShorthand(parts[0]), ...parts.slice(1)].join(' ');
  };
  return normalizeLeadingCheckSuggestionSideShorthand;
}
