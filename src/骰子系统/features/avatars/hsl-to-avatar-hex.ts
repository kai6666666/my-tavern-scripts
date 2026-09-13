// @ts-nocheck
/**
 * hsl-to-avatar-hex.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createHslToAvatarHex(deps: any) {
  const hslToAvatarHex = (h: number, s: number, l: number): string => {
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const hp = h / 60;
    const x = c * (1 - Math.abs((hp % 2) - 1));
    let r1 = 0;
    let g1 = 0;
    let b1 = 0;
    if (hp >= 0 && hp < 1) {
      r1 = c;
      g1 = x;
    } else if (hp < 2) {
      r1 = x;
      g1 = c;
    } else if (hp < 3) {
      g1 = c;
      b1 = x;
    } else if (hp < 4) {
      g1 = x;
      b1 = c;
    } else if (hp < 5) {
      r1 = x;
      b1 = c;
    } else {
      r1 = c;
      b1 = x;
    }
    const m = l - c / 2;
    return deps.rgbToAvatarHex((r1 + m) * 255, (g1 + m) * 255, (b1 + m) * 255);
  };
  return hslToAvatarHex;
}
