// @ts-nocheck
/**
 * create-diff-row-matcher.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createCreateDiffRowMatcher(deps: any) {
  const createDiffRowMatcher = (headers: DiffRow, rows: DiffRow[]): DiffRowMatcher => {
    const byKey = new Map<string, DiffRowMatch[]>();
    rows.forEach((row, index) => {
      deps.getDiffRowIdentityKeys(headers, row).forEach(key => {
        const queue = byKey.get(key) ?? [];
        queue.push({ index, row });
        byKey.set(key, queue);
      });
    });
    return { byKey, rows, usedIndices: new Set<number>() };
  };
  return createDiffRowMatcher;
}
