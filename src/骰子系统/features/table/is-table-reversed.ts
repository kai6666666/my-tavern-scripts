// @ts-nocheck
/**
 * is-table-reversed.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createIsTableReversed(deps: any) {
  const isTableReversed = tableName => {
    return deps.getNormalizedReverseTables().includes(tableName);
  };
  return isTableReversed;
}
