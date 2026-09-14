// @ts-nocheck
/**
 * resolve-check-suggestion-character-name.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createResolveCheckSuggestionCharacterName(deps: any) {
  const resolveCheckSuggestionCharacterName = (name: string): string => {
    const trimmed = String(name || '').trim();
    return deps.resolveCanonicalCharacterName(trimmed);
  };
  return resolveCheckSuggestionCharacterName;
}
