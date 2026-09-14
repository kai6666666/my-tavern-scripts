// @ts-nocheck
/**
 * normalize-storable-image-url.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createNormalizeStorableImageUrl(deps: any) {
  const normalizeStorableImageUrl = (url: unknown): string => {
    const normalizedUrl = deps.normalizeImageUrlInput(url);
    return normalizedUrl && deps.isRemoteImageUrlValid(normalizedUrl) ? normalizedUrl : '';
  };
  return normalizeStorableImageUrl;
}
