// @ts-nocheck
/**
 * remember-auto-regex-transform.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createRememberAutoRegexTransform(deps: any) {
  const rememberAutoRegexTransform = (key: string): void => {
    if (!key) return;
    deps.setLastAutoRegexTransformKey(key);
    deps.setLastAutoRegexTransformAt(Date.now());
  };
  return rememberAutoRegexTransform;
}
