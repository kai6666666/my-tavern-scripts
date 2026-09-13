// @ts-nocheck
/**
 * is-gacha-field-alias.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createIsGachaFieldAlias(deps: any) {
  const isGachaFieldAlias = (value: unknown, aliases: readonly string[]): boolean => {
    const normalized = deps.normalizeGachaFieldAlias(value);
    return Boolean(normalized) && aliases.some(alias => deps.normalizeGachaFieldAlias(alias) === normalized);
  };
  return isGachaFieldAlias;
}
