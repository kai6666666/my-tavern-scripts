// @ts-nocheck
/**
 * is-renderable-image-url-valid.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createIsRenderableImageUrlValid(deps: any) {
  const isRenderableImageUrlValid = (url: string): boolean => {
    const parsedUrl = deps.parseImageUrl(url);
    if (!parsedUrl) return false;
    if (deps.getINTERNAL_IMAGE_ALLOWED_PROTOCOLS().has(parsedUrl.protocol)) return true;
    return deps.getRemoteImageUrlValidationError(url) === null;
  };
  return isRenderableImageUrlValid;
}
