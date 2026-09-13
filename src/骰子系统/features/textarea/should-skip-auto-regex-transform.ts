// @ts-nocheck
/**
 * should-skip-auto-regex-transform.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createShouldSkipAutoRegexTransform(deps: any) {
  const shouldSkipAutoRegexTransform = (key: string): boolean =>
    Boolean(
      key &&
      key === deps.getLastAutoRegexTransformKey() &&
      Date.now() - deps.getLastAutoRegexTransformAt() < deps.getAUTO_REGEX_TRANSFORM_COOLDOWN_MS(),
    );
  return shouldSkipAutoRegexTransform;
}
