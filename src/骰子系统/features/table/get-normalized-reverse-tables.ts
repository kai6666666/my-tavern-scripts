// @ts-nocheck
/**
 * get-normalized-reverse-tables.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetNormalizedReverseTables(deps: any) {
  const getNormalizedReverseTables = () => deps.normalizeTableNameList(deps.getReverseTables());
  return getNormalizedReverseTables;
}
