// @ts-nocheck
/**
 * build-avatar-background-style.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createBuildAvatarBackgroundStyle(deps: any) {
  const buildAvatarBackgroundStyle = (
    imageUrl: unknown,
    offsetX: unknown = 50,
    offsetY: unknown = 50,
    scale: unknown = 150,
  ): string => {
    const cssImageUrl = deps.formatCssImageUrl(imageUrl, { allowInternalObjectUrl: true });
    if (!cssImageUrl) return '';
    const normalizedScale = Number(scale);
    const normalizedOffsetX = Number(offsetX);
    const normalizedOffsetY = Number(offsetY);
    return `background-image:${cssImageUrl};background-size:${Number.isFinite(normalizedScale) ? normalizedScale : 150}%;background-position:${Number.isFinite(normalizedOffsetX) ? normalizedOffsetX : 50}% ${Number.isFinite(normalizedOffsetY) ? normalizedOffsetY : 50}%;`;
  };
  return buildAvatarBackgroundStyle;
}
