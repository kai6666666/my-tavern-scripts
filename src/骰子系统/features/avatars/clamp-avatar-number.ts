// @ts-nocheck
/**
 * clamp-avatar-number.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createClampAvatarNumber(deps: any) {
  const clampAvatarNumber = (value: unknown, min: number, max: number, fallback: number): number => {
    const num = Number(value);
    if (!Number.isFinite(num)) return fallback;
    return Math.max(min, Math.min(max, num));
  };
  return clampAvatarNumber;
}
