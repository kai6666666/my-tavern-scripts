// @ts-nocheck
/**
 * build-gacha-table-result-from-sheet.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createBuildGachaTableResultFromSheet(deps: any) {
  const buildGachaTableResultFromSheet = (entry: { key: string; sheet: any }, config) => {
    const sheet = entry.sheet || {};
    const content = Array.isArray(sheet.content) ? sheet.content : [];
    const rows = content.slice(1).map((row, rowIndex) => {
      if (row && typeof row === 'object') {
        Object.defineProperty(row, deps.GACHA_CATALOG_RAW_ROW_INDEX_PROP, {
          value: rowIndex,
          configurable: true,
        });
      }
      return row;
    });
    return {
      data: {
        key: entry.key,
        headers: content[0] || [],
        rows,
        rawContent: content,
        exportConfig: sheet.exportConfig || {},
        updateConfig: sheet.updateConfig || {},
        ...sheet,
      },
      name: sheet.name || entry.key,
      key: entry.key,
      config,
    };
  };
  return buildGachaTableResultFromSheet;
}
