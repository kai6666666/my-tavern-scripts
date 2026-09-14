// @ts-nocheck
/**
 * set-all-tables-reverse.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createSetAllTablesReverse(deps: any) {
  const setAllTablesReverse = (tableNames, enabled) => {
    const targetNames = deps.normalizeTableNameList(tableNames);
    if (targetNames.length === 0) return;

    const targetSet = new Set(targetNames);
    if (enabled) {
      deps.saveReverseTables(Array.from(new Set([...deps.getNormalizedReverseTables(), ...targetNames])));
    } else {
      deps.saveReverseTables(deps.getNormalizedReverseTables().filter(name => !targetSet.has(name)));
    }
  };
  return setAllTablesReverse;
}
