// @ts-nocheck
/**
 * generate-diff-map.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGenerateDiffMap(deps: any) {
  const generateDiffMap = currentData => {
    const lastData = deps.loadSnapshot();
    const diffSet = new Set();
    if (!lastData || !currentData) return diffSet;

    for (const sheetId in currentData) {
      const newSheet = currentData[sheetId];
      if (!newSheet || !newSheet.name) continue;
      const tableName = newSheet.name;
      const oldSheet = deps.findDiffSnapshotEntry(lastData, sheetId, newSheet)?.sheet;

      if (!oldSheet?.content) {
        // 整个表是新的
        if (newSheet.content) {
          newSheet.content.forEach((row, rIdx) => {
            if (rIdx > 0) diffSet.add(`${tableName}-row-${rIdx - 1}`);
          });
        }
        continue;
      }

      const headers = deps.getDiffHeaders(newSheet);
      const oldHeaders = deps.getDiffHeaders(oldSheet);
      const newRows = deps.getDiffRows(newSheet);
      const oldRows = deps.getDiffRows(oldSheet);
      const matcher = deps.createDiffRowMatcher(oldHeaders, oldRows);

      // 遍历当前数据
      newRows.forEach((row, rIdx) => {
        const matched = deps.takeDiffRowMatch(matcher, headers, row, rIdx);

        if (!matched) {
          // 在快照中找不到匹配的行，标记整行为新增
          diffSet.add(`${tableName}-row-${rIdx}`);
        } else {
          // 找到匹配，对比每个单元格
          row.forEach((cell, cIdx) => {
            if (cIdx === 0) return; // 跳过索引列
            const oldCell = matched.row[cIdx];
            if (String(cell ?? '') !== String(oldCell ?? '')) {
              diffSet.add(`${tableName}-${rIdx}-${cIdx}`);
            }
          });
        }
      });
    }
    return diffSet;
  };
  return generateDiffMap;
}
