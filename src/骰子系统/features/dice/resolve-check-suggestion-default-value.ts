// @ts-nocheck
/**
 * resolve-check-suggestion-default-value.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createResolveCheckSuggestionDefaultValue(deps: any) {
  const resolveCheckSuggestionDefaultValue = (
    defaultValue: number | string | boolean | undefined,
    context: Record<string, number>,
  ): number => {
    if (defaultValue === undefined || defaultValue === '') return 0;
    if (typeof defaultValue === 'number') return defaultValue;
    if (typeof defaultValue === 'boolean') return defaultValue ? 1 : 0;
    const result = deps.evaluateFormula(String(defaultValue), context);
    return Number.isFinite(result) ? result : 0;
  };
  return resolveCheckSuggestionDefaultValue;
}
