// @ts-nocheck
/**
 * hash-gacha-seed.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createHashGachaSeed(deps: any) {
  const hashGachaSeed = (value: string): number => {
    let hash = 2166136261;
    for (let index = 0; index < value.length; index++) {
      hash ^= value.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  };
  return hashGachaSeed;
}
