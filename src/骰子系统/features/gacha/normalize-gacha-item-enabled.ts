// @ts-nocheck
/**
 * normalize-gacha-item-enabled.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createNormalizeGachaItemEnabled(deps: any) {
  const normalizeGachaItemEnabled = (value: unknown): boolean => value !== false;
  return normalizeGachaItemEnabled;
}
