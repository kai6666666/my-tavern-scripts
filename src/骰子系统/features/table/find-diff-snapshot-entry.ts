// @ts-nocheck
/**
 * find-diff-snapshot-entry.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createFindDiffSnapshotEntry(deps: any) {
  const findDiffSnapshotEntry = (
    snapshot: unknown,
    sheetId: string,
    currentSheet: unknown,
  ): { key: string; sheet: DiffSheet } | null => {
    const snapshotRecord = deps.asDiffRecord(snapshot);
    if (!snapshotRecord) return null;

    const directSheet = snapshotRecord[sheetId];
    if (deps.isDiffSheet(directSheet)) return { key: sheetId, sheet: directSheet };

    const currentIdentity = deps.getDiffSheetIdentity(currentSheet);
    const sheetKeys = Object.keys(snapshotRecord).filter(key => key.startsWith('sheet_'));

    if (currentIdentity.uid) {
      const matchedKey = sheetKeys.find(key => deps.getDiffSheetIdentity(snapshotRecord[key]).uid === currentIdentity.uid);
      const matchedSheet = matchedKey ? snapshotRecord[matchedKey] : null;
      if (matchedKey && deps.isDiffSheet(matchedSheet)) return { key: matchedKey, sheet: matchedSheet };
    }

    if (currentIdentity.name) {
      const matchedKey = sheetKeys.find(key => deps.getDiffSheetIdentity(snapshotRecord[key]).name === currentIdentity.name);
      const matchedSheet = matchedKey ? snapshotRecord[matchedKey] : null;
      if (matchedKey && deps.isDiffSheet(matchedSheet)) return { key: matchedKey, sheet: matchedSheet };
    }

    return null;
  };
  return findDiffSnapshotEntry;
}
