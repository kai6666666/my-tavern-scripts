// @ts-nocheck
/**
 * parse-advanced-preset-json-candidate.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createParseAdvancedPresetJsonCandidate(deps: any) {
  const parseAdvancedPresetJsonCandidate = (candidate: string): unknown => deps.parseJsoncValue(candidate);
  return parseAdvancedPresetJsonCandidate;
}
