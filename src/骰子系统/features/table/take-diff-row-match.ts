// @ts-nocheck
/**
 * take-diff-row-match.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createTakeDiffRowMatch(deps: any) {
  const takeDiffRowMatch = (
    matcher: DiffRowMatcher,
    headers: DiffRow,
    row: DiffRow,
    rowIndex: number,
  ): DiffRowMatch | null => {
    for (const key of deps.getDiffRowIdentityKeys(headers, row)) {
      const queue = matcher.byKey.get(key);
      while (queue?.length) {
        const candidate = queue.shift();
        if (candidate && !matcher.usedIndices.has(candidate.index)) {
          matcher.usedIndices.add(candidate.index);
          return candidate;
        }
      }
    }

    const positionalRow = matcher.rows[rowIndex];
    if (positionalRow && !matcher.usedIndices.has(rowIndex)) {
      matcher.usedIndices.add(rowIndex);
      return { index: rowIndex, row: positionalRow };
    }

    return null;
  };
  return takeDiffRowMatch;
}
