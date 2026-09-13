// @ts-nocheck
/**
 * load-avatar-image-for-color.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createLoadAvatarImageForColor(deps: any) {
  const loadAvatarImageForColor = (source: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.decoding = 'async';
      if (!/^(blob|data):/i.test(source)) {
        image.crossOrigin = 'anonymous';
      }
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('头像图片无法读取'));
      image.src = source;
    });
  return loadAvatarImageForColor;
}
