// @ts-nocheck
/**
 * perform-save-data-only.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createPerformSaveDataOnly(deps: any) {
  const performSaveDataOnly = async (tableData, modifiedSheetKeys?: string[]) => {
    try {
      return await deps.applyRuntimeDataViaCrud(tableData, modifiedSheetKeys);
    } catch (e) {
      console.error(
        '[DICE]ACU saveDataOnly error:',
        deps.getRuntimeErrorLogPayload(e),
        modifiedSheetKeys ? { modifiedSheetKeys } : undefined,
      );
      throw e;
    }
  };
  return performSaveDataOnly;
}
