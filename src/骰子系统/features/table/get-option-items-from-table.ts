// @ts-nocheck
/**
 * get-option-items-from-table.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetOptionItemsFromTable(deps: any) {
  const getOptionItemsFromTable = tableData => {
    const items: { text: string; rowIndex: number; colIndex: number; header: string }[] = [];
    const rows = Array.isArray(tableData?.rows) ? tableData.rows : [];
    const headers = Array.isArray(tableData?.headers) ? tableData.headers : [];

    rows.forEach((row, rowIndex) => {
      if (!Array.isArray(row)) return;
      row.forEach((cell, colIndex) => {
        if (colIndex <= 0) return;
        const text = String(cell ?? '').trim();
        if (!text) return;
        items.push({
          text,
          rowIndex,
          colIndex,
          header: String(headers[colIndex] ?? ''),
        });
      });
    });

    return items;
  };
  return getOptionItemsFromTable;
}
