// @ts-nocheck
/**
 * get-remote-image-url-validation-error.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetRemoteImageUrlValidationError(deps: any) {
  const getRemoteImageUrlValidationError = (url: string): ImageUrlValidationReason | null => {
    const parsedUrl = deps.parseImageUrl(url);
    if (!parsedUrl) return 'invalid_url';
    if (!deps.getREMOTE_IMAGE_ALLOWED_PROTOCOLS().has(parsedUrl.protocol)) return 'invalid_protocol';
    if (parsedUrl.pathname.toLowerCase().endsWith('.svg')) return 'svg_url';
    return null;
  };
  return getRemoteImageUrlValidationError;
}
