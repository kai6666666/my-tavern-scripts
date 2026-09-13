// @ts-nocheck
/**
 * parse-image-url.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createParseImageUrl(deps: any) {
  const parseImageUrl = (url: string): URL | null => {
    const normalizedUrl = deps.normalizeImageUrlInput(url);
    if (!normalizedUrl) return null;
    try {
      return new URL(normalizedUrl, window.location.href);
    } catch {
      return null;
    }
  };
  return parseImageUrl;
}
