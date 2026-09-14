// @ts-nocheck
/**
 * save-data-only.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createSaveDataOnly(deps: any) {
  const saveDataOnly = async (tableData, modifiedSheetKeys?: string[]) =>
    deps.runInSaveQueue(() => deps.performSaveDataOnly(tableData, modifiedSheetKeys));
  return saveDataOnly;
}
