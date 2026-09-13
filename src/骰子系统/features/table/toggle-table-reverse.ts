// @ts-nocheck
/**
 * toggle-table-reverse.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createToggleTableReverse(deps: any) {
  const toggleTableReverse = tableName => {
    const list = deps.getNormalizedReverseTables();
    const idx = list.indexOf(tableName);
    if (idx >= 0) {
      list.splice(idx, 1);
    } else {
      list.push(tableName);
    }
    deps.saveReverseTables(list);
    console.log('[DICE]ACU toggleTableReverse:', tableName, 'reversed:', idx < 0);
  };
  return toggleTableReverse;
}
