// @ts-nocheck
/**
 * get-custom-table-name-icon-manager-raw-sheets.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetCustomTableNameIconManagerRawSheets(deps: any) {
  const getCustomTableNameIconManagerRawSheets = (): CustomTableNameIconManagerRawSheet[] => {
    const rawData = deps.getTableData({ silent: true }) as unknown;
    if (!deps.isRecord(rawData)) return [];

    return Object.entries(rawData).reduce<CustomTableNameIconManagerRawSheet[]>((result, [key, sheet]) => {
      if (!key.startsWith('sheet_') || !deps.isRecord(sheet)) return result;
      const name = typeof sheet.name === 'string' ? sheet.name.trim() : '';
      const content = sheet.content;
      if (!name || !deps.isTwoDimensionalArray(content)) return result;
      result.push({ key, name, content });
      return result;
    }, []);
  };
  return getCustomTableNameIconManagerRawSheets;
}
