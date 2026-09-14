// @ts-nocheck
/**
 * normalize-avatar-hex-color.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createNormalizeAvatarHexColor(deps: any) {
  const normalizeAvatarHexColor = (value: unknown): string | null => {
    const raw = String(value ?? '').trim();
    const hex = raw.startsWith('#') ? raw.slice(1) : raw;
    if (/^[0-9a-fA-F]{3}$/.test(hex)) {
      return `#${hex
        .split('')
        .map(char => `${char}${char}`)
        .join('')
        .toUpperCase()}`;
    }
    if (/^[0-9a-fA-F]{6}$/.test(hex)) {
      return `#${hex.toUpperCase()}`;
    }
    return null;
  };
  return normalizeAvatarHexColor;
}
