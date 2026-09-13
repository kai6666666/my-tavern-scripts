// @ts-nocheck
/**
 * has-sheet-keys.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createHasSheetKeys(deps: any) {
  const hasSheetKeys = (value: unknown): boolean => {
    if (!value || typeof value !== 'object') return false;
    return Object.keys(value as Record<string, unknown>).some(key => key.startsWith('sheet_'));
  };
  return hasSheetKeys;
}
