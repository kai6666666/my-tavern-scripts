// @ts-nocheck
/**
 * get-crud-sheet-ddl.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetCrudSheetDdl(deps: any) {
  const getCrudSheetDdl = (sheet: unknown): string => {
    const sheetRecord = deps.asDiffRecord(sheet);
    const sourceRecord = deps.asDiffRecord(sheetRecord?.sourceData);
    return String(sourceRecord?.ddl || '');
  };
  return getCrudSheetDdl;
}
