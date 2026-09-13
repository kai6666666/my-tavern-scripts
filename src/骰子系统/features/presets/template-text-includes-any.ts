// @ts-nocheck
/**
 * template-text-includes-any.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createTemplateTextIncludesAny(deps: any) {
  const templateTextIncludesAny = (value: string, matches: string[]): boolean => {
    const normalizedValue = deps.normalizeTemplateInspectText(value);
    return matches.some(match => normalizedValue.includes(deps.normalizeTemplateInspectText(match)));
  };
  return templateTextIncludesAny;
}
