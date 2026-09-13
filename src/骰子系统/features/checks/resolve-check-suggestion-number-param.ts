// @ts-nocheck
/**
 * resolve-check-suggestion-number-param.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createResolveCheckSuggestionNumberParam(deps: any) {
  const resolveCheckSuggestionNumberParam = (
    value: CheckSuggestionParamValue | undefined,
    characterName: string,
    fallback: number,
    options?: { preferAttribute?: boolean },
  ): number => {
    if (value === undefined || value === '') return fallback;
    if (typeof value === 'number') return value;
    if (typeof value === 'boolean') return value ? 1 : 0;
    const text = String(value).trim();
    if (!text) return fallback;
    if (options?.preferAttribute !== false) {
      const attrValue = deps.getAttributeValue(characterName, text);
      if (attrValue !== null) return attrValue;
    }
    const parsed = deps.parseCheckSuggestionModifierValue(text);
    return Number.isFinite(parsed) ? parsed : fallback;
  };
  return resolveCheckSuggestionNumberParam;
}
