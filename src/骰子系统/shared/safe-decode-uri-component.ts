// @ts-nocheck
/**
 * safe-decode-uri-component.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createSafeDecodeURIComponent(deps: any) {
  const safeDecodeURIComponent = (value: unknown): string => {
    const text = String(value ?? '');
    try {
      return decodeURIComponent(text);
    } catch {
      return deps.stripLoneSurrogates(text);
    }
  };
  return safeDecodeURIComponent;
}
