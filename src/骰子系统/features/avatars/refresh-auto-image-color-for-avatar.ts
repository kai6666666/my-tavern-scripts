// @ts-nocheck
/**
 * refresh-auto-image-color-for-avatar.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createRefreshAutoImageColorForAvatar(deps: any) {
  const refreshAutoImageColorForAvatar = async (
    name: string,
    imageSource?: string | null,
    options: { offsetX?: unknown; offsetY?: unknown; scale?: unknown } = {},
  ): Promise<string> => {
    if (deps.AvatarManager.getImageColorSource(name) === 'manual') {
      return deps.AvatarManager.getImageColor(name);
    }

    const source = String(imageSource || (await deps.AvatarManager.getAsync(name)) || '').trim();
    if (!source) {
      const fallbackColor = deps.getAvatarFallbackColor(name);
      deps.AvatarManager.setImageColor(name, fallbackColor, 'auto');
      return fallbackColor;
    }

    const color = await deps.inferAvatarImageColor(source, {
      offsetX: options.offsetX ?? deps.AvatarManager.getOffsetX(name),
      offsetY: options.offsetY ?? deps.AvatarManager.getOffsetY(name),
      scale: options.scale ?? deps.AvatarManager.getScale(name),
    });

    if (color) {
      deps.AvatarManager.setImageColor(name, color, 'auto');
    } else {
      deps.AvatarManager.setImageColor(name, deps.getAvatarFallbackColor(name), 'auto');
    }

    return deps.AvatarManager.getImageColor(name);
  };
  return refreshAutoImageColorForAvatar;
}
