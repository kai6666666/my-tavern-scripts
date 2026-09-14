// @ts-nocheck
/**
 * get-avatar-fallback-color.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetAvatarFallbackColor(deps: any) {
  const getAvatarFallbackColor = (name: unknown): string => {
    const text = String(name ?? '').trim() || 'avatar';
    let hash = 2166136261;
    for (let i = 0; i < text.length; i++) {
      hash ^= text.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    const hue = Math.abs(hash) % 360;
    const saturation = 0.54 + ((hash >>> 8) % 18) / 100;
    const lightness = 0.46 + ((hash >>> 16) % 14) / 100;
    return deps.hslToAvatarHex(hue, saturation, lightness);
  };
  return getAvatarFallbackColor;
}
