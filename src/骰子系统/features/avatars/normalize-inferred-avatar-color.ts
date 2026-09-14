// @ts-nocheck
/**
 * normalize-inferred-avatar-color.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createNormalizeInferredAvatarColor(deps: any) {
  const normalizeInferredAvatarColor = (r: number, g: number, b: number): string => {
    const hsl = deps.rgbToAvatarHsl(r, g, b);
    const s = Math.max(0.28, Math.min(0.72, hsl.s));
    const l = Math.max(0.34, Math.min(0.66, hsl.l));
    return deps.hslToAvatarHex(hsl.h, s, l);
  };
  return normalizeInferredAvatarColor;
}
