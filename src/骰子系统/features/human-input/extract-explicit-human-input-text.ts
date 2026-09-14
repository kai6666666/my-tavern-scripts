// @ts-nocheck
/**
 * extract-explicit-human-input-text.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createExtractExplicitHumanInputText(deps: any) {
  const extractExplicitHumanInputText = (text: string): string => {
    const matches = Array.from(text.matchAll(/<本轮用户输入>([\s\S]*?)<\/本轮用户输入>/gi))
      .map(match => deps.normalizeTrackedText(match[1]))
      .filter(Boolean);
    return deps.normalizeTrackedText(matches.join('\n'));
  };
  return extractExplicitHumanInputText;
}
