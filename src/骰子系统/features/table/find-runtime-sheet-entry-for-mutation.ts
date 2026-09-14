// @ts-nocheck
/**
 * find-runtime-sheet-entry-for-mutation.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createFindRuntimeSheetEntryForMutation(deps: any) {
  const findRuntimeSheetEntryForMutation = (
    rawData: unknown,
    tableKey: string,
  ): { key: string; sheet: DiffSheet } | null => {
    const directEntry = deps.findDiffSnapshotEntry(rawData, tableKey, deps.getDiffSheetByKey(rawData, tableKey));
    if (directEntry?.sheet) return directEntry;

    const record = deps.asDiffRecord(rawData);
    if (!record) return null;
    const normalizedTableKey = deps.normalizeDiffText(tableKey);
    if (!normalizedTableKey) return null;
    const normalizedTableKeyLower = normalizedTableKey.toLowerCase();
    const tableNameWithoutPrefix = normalizedTableKeyLower.replace(/^sheet_/, '');

    const getSheetSqlTableName = (sheet: unknown): string => {
      const sheetRecord = deps.asDiffRecord(sheet);
      const sourceData = deps.asDiffRecord(sheetRecord?.sourceData);
      const directName = deps.normalizeDiffText(
        sourceData?.tableName || sourceData?.sqlTableName || sourceData?.databaseTableName,
      );
      if (directName) return directName;
      const ddl = deps.stripCrudSqlComments(sourceData?.ddl || '');
      const match = ddl.match(
        new RegExp(`\\bCREATE\\s+TABLE\\s+(?:IF\\s+NOT\\s+EXISTS\\s+)?${deps.getCRUD_SQL_IDENTIFIER_PATTERN()}`, 'i'),
      );
      return deps.normalizeDiffText(deps.decodeCrudSqlIdentifier(match?.[1], match?.[2], match?.[3], match?.[4]));
    };

    const matchesTargetKey = (candidate: unknown): boolean => {
      const normalizedCandidate = deps.normalizeDiffText(candidate).toLowerCase();
      if (!normalizedCandidate) return false;
      return (
        normalizedCandidate === normalizedTableKeyLower ||
        normalizedCandidate.replace(/^sheet_/, '') === tableNameWithoutPrefix
      );
    };

    const matchedKey = Object.keys(record).find(key => {
      const sheet = record[key];
      if (!deps.isDiffSheet(sheet)) return false;
      const identity = deps.getDiffSheetIdentity(sheet);
      return (
        matchesTargetKey(key) ||
        matchesTargetKey(identity.uid) ||
        matchesTargetKey(identity.name) ||
        matchesTargetKey(getSheetSqlTableName(sheet))
      );
    });
    const matchedSheet = matchedKey ? record[matchedKey] : null;
    return matchedKey && deps.isDiffSheet(matchedSheet) ? { key: matchedKey, sheet: matchedSheet } : null;
  };
  return findRuntimeSheetEntryForMutation;
}
