// @ts-nocheck
/**
 * get-check-suggestion-items-from-table.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetCheckSuggestionItemsFromTable(deps: any) {
  const getCheckSuggestionItemsFromTable = tableData => {
    const items: { displayText: string; commandText: string; rowIndex: number; rowId: string }[] = [];
    const rows = Array.isArray(tableData?.rows) ? tableData.rows : [];
    const headers = Array.isArray(tableData?.headers) ? tableData.headers : [];
    const displayCol = headers.findIndex(header => String(header || '').includes('展示'));
    const commandCol = headers.findIndex(header => String(header || '').includes('骰子命令'));
    const safeDisplayCol = displayCol >= 0 ? displayCol : 1;
    const safeCommandCol = commandCol >= 0 ? commandCol : 2;

    rows.forEach((row, rowIndex) => {
      if (!Array.isArray(row)) return;
      const displayText = String(row[safeDisplayCol] ?? '').trim();
      const commandText = String(row[safeCommandCol] ?? '').trim();
      if (!displayText && !commandText) return;
      items.push({
        displayText,
        commandText,
        rowIndex,
        rowId: String(row[0] ?? rowIndex + 1),
      });
    });

    return items;
  };
  return getCheckSuggestionItemsFromTable;
}
