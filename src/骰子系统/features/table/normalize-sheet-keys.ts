// @ts-nocheck
/**
 * normalize-sheet-keys.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createNormalizeSheetKeys(deps: any) {
  const normalizeSheetKeys = (keys?: string[]): string[] | null => {
    if (!Array.isArray(keys)) return null;
    return Array.from(new Set(keys.map(key => String(key || '').trim()).filter(key => key.startsWith('sheet_'))));
  };
  return normalizeSheetKeys;
}
