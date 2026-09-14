// @ts-nocheck
/**
 * create-sheet-data-fingerprint.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createCreateSheetDataFingerprint(deps: any) {
  const createSheetDataFingerprint = (rawData: unknown): string => {
    if (!rawData || typeof rawData !== 'object') return '';
    const tableRecord = rawData as Record<string, unknown>;
    const sheetEntries = Object.entries(tableRecord)
      .filter(([key, value]) => key.startsWith('sheet_') && value && typeof value === 'object')
      .map(([key, value]) => {
        const sheet = value as Record<string, unknown>;
        return [key, sheet.name, sheet.content];
      })
      .sort((left, right) => String(left[0]).localeCompare(String(right[0])));
    return JSON.stringify(sheetEntries);
  };
  return createSheetDataFingerprint;
}
