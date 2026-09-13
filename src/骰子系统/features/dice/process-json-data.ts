// @ts-nocheck
/**
 * process-json-data.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createProcessJsonData(deps: any) {
  const processJsonData = json => {
    const tables = {};
    if (!json || typeof json !== 'object') return tables;
    for (const sheetId in json) {
      if (json[sheetId]?.name) {
        const sheet = json[sheetId];
        const rows = sheet.content
          ? sheet.content.slice(1).map((row, rowIndex) => {
              if (row && typeof row === 'object') {
                Object.defineProperty(row, deps.GACHA_CATALOG_RAW_ROW_INDEX_PROP, {
                  value: rowIndex,
                  configurable: true,
                });
              }
              return row;
            })
          : [];
        tables[sheet.name] = {
          key: sheetId,
          headers: sheet.content ? sheet.content[0] || [] : [],
          rows,
          rawContent: sheet.content || [],
          exportConfig: sheet.exportConfig || {},
          updateConfig: sheet.updateConfig || {},
          ...sheet,
        };
      }
    }
    return tables;
  };
  return processJsonData;
}
