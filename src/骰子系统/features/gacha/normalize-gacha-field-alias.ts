// @ts-nocheck
/**
 * normalize-gacha-field-alias.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createNormalizeGachaFieldAlias(deps: any) {
  const normalizeGachaFieldAlias = (value: unknown): string => String(value || '').trim().toLowerCase();
  return normalizeGachaFieldAlias;
}
