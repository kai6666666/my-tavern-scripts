// @ts-nocheck
/**
 * get-sheet-key-by-table-name.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetSheetKeyByTableName(deps: any) {
  function getSheetKeyByTableName(tableName: string): string | null {
    try {
      const data = deps.getTableData({ silent: true }) as Record<
        string,
        { name: string; content: (string | number | null)[][] }
      > | null;
      if (!data) return null;

      for (const key in data) {
        if (key.startsWith('sheet_') && data[key]?.name === tableName) {
          return key;
        }
      }
    } catch (e) {
      console.warn('[DICE]getSheetKeyByTableName 失败:', e);
    }
    return null;
  }
  return getSheetKeyByTableName;
}
