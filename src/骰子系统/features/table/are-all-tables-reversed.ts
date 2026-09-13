// @ts-nocheck
/**
 * are-all-tables-reversed.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createAreAllTablesReversed(deps: any) {
  const areAllTablesReversed = tableNames => {
    const names = deps.normalizeTableNameList(tableNames);
    if (names.length === 0) return false;
    const reverseSet = new Set(deps.getNormalizedReverseTables());
    return names.every(name => reverseSet.has(name));
  };
  return areAllTablesReversed;
}
