// @ts-nocheck
/**
 * count-runtime-data-changes.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createCountRuntimeDataChanges(deps: any) {
  const countRuntimeDataChanges = (snapshot: unknown, rawData: unknown): number => {
    const rawRecord = deps.asDiffRecord(rawData);
    const snapshotRecord = deps.asDiffRecord(snapshot);
    if (!rawRecord || !snapshotRecord) return 0;

    let changesCount = 0;
    const matchedSnapshotKeys = new Set<string>();

    for (const sheetId in rawRecord) {
      if (!sheetId.startsWith('sheet_')) continue;
      const newSheet = rawRecord[sheetId];
      if (!deps.isDiffSheet(newSheet)) continue;

      const snapshotEntry = deps.findDiffSnapshotEntry(snapshotRecord, sheetId, newSheet);
      const oldSheet = snapshotEntry?.sheet;
      if (snapshotEntry) matchedSnapshotKeys.add(snapshotEntry.key);

      if (!oldSheet?.content) {
        changesCount++;
        continue;
      }

      const headers = deps.getDiffHeaders(newSheet);
      const oldHeaders = deps.getDiffHeaders(oldSheet);
      if (JSON.stringify(headers) !== JSON.stringify(oldHeaders)) {
        changesCount++;
        continue;
      }

      const newRows = deps.getDiffRows(newSheet);
      const oldRows = deps.getDiffRows(oldSheet);
      const matcher = deps.createDiffRowMatcher(oldHeaders, oldRows);

      newRows.forEach((row, rowIndex) => {
        const matched = deps.takeDiffRowMatch(matcher, headers, row, rowIndex);
        if (!matched) {
          changesCount++;
          return;
        }

        const hasChange = row.some((cell, colIndex) => {
          if (colIndex === 0) return false;
          return String(cell ?? '') !== String(matched.row[colIndex] ?? '');
        });
        if (hasChange) changesCount++;
      });

      changesCount += oldRows.filter((_, rowIndex) => !matcher.usedIndices.has(rowIndex)).length;
    }

    for (const sheetId in snapshotRecord) {
      if (sheetId.startsWith('sheet_') && !matchedSnapshotKeys.has(sheetId) && !rawRecord[sheetId]) changesCount++;
    }

    return changesCount;
  };
  return countRuntimeDataChanges;
}
