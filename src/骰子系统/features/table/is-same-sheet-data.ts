// @ts-nocheck
/**
 * is-same-sheet-data.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createIsSameSheetData(deps: any) {
  const isSameSheetData = (leftData: unknown, rightData: unknown): boolean => {
    const leftFingerprint = deps.createSheetDataFingerprint(leftData);
    const rightFingerprint = deps.createSheetDataFingerprint(rightData);
    return Boolean(leftFingerprint && rightFingerprint && leftFingerprint === rightFingerprint);
  };
  return isSameSheetData;
}
