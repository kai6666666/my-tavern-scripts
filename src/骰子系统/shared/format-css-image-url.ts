// @ts-nocheck
/**
 * format-css-image-url.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createFormatCssImageUrl(deps: any) {
  const formatCssImageUrl = (url: unknown, options: { allowInternalObjectUrl?: boolean } = {}): string => {
    const normalizedUrl = deps.normalizeImageUrlInput(url);
    if (!normalizedUrl) return '';
    const isAllowed = options.allowInternalObjectUrl
      ? deps.isRenderableImageUrlValid(normalizedUrl)
      : deps.isRemoteImageUrlValid(normalizedUrl);
    return isAllowed ? `url("${deps.escapeCssString(normalizedUrl)}")` : '';
  };
  return formatCssImageUrl;
}
