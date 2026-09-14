// @ts-nocheck
/**
 * rgb-to-avatar-hex.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createRgbToAvatarHex(deps: any) {
  const rgbToAvatarHex = (r: number, g: number, b: number): string => {
    const toHex = (value: number) =>
      Math.max(0, Math.min(255, Math.round(value)))
        .toString(16)
        .padStart(2, '0')
        .toUpperCase();
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };
  return rgbToAvatarHex;
}
