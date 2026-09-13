// @ts-nocheck
/**
 * patch-crud-sheet-in-record.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createPatchCrudSheetInRecord(deps: any) {
  const patchCrudSheetInRecord = (record: unknown, sheetKey: string, desiredSheet: unknown): string | null => {
    const recordObj = deps.asDiffRecord(record);
    if (!recordObj || !deps.isDiffSheet(desiredSheet)) return null;
    const entry = deps.findDiffSnapshotEntry(recordObj, sheetKey, desiredSheet);
    if (!entry) return null;
    recordObj[entry.key] = deps.cloneRuntimeDataValue(desiredSheet);
    return entry.key;
  };
  return patchCrudSheetInRecord;
}
