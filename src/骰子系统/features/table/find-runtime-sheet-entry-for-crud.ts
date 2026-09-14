// @ts-nocheck
/**
 * find-runtime-sheet-entry-for-crud.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createFindRuntimeSheetEntryForCrud(deps: any) {
  const findRuntimeSheetEntryForCrud = (
    latestData: unknown,
    sheetKey: string,
    desiredSheet: unknown,
  ): { key: string; sheet: DiffSheet } | null => deps.findDiffSnapshotEntry(latestData, sheetKey, desiredSheet);
  return findRuntimeSheetEntryForCrud;
}
