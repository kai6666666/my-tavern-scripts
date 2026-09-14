// @ts-nocheck
/**
 * count-unicode-characters.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createCountUnicodeCharacters(deps: any) {
  const countUnicodeCharacters = (text: string): number => Array.from(String(text || '')).length;
  return countUnicodeCharacters;
}
