// @ts-nocheck
/**
 * parse-jsonc-value.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createParseJsoncValue(deps: any) {
  const parseJsoncValue = (jsonText: string): unknown => JSON.parse(deps.stripJsoncSyntax(jsonText));
  return parseJsoncValue;
}
