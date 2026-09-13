// @ts-nocheck
/**
 * safe-encode-uri-component.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createSafeEncodeURIComponent(deps: any) {
  const safeEncodeURIComponent = (value: unknown): string => {
    const text = String(value ?? '');
    try {
      return encodeURIComponent(text);
    } catch {
      return encodeURIComponent(deps.stripLoneSurrogates(text));
    }
  };
  return safeEncodeURIComponent;
}
