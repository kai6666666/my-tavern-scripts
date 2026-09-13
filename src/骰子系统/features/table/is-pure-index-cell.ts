// @ts-nocheck
/**
 * is-pure-index-cell.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createIsPureIndexCell(deps: any) {
  const isPureIndexCell = (headers: unknown[], columnIndex: number, value: unknown): boolean => {
    const headerText = String(headers[columnIndex] ?? '')
      .trim()
      .toLowerCase();
    const cellText = deps.getStringLikeCellText(value);
    return (
      deps.getGLOBAL_INTERACTION_INDEX_HEADERS().some(keyword => headerText.includes(keyword.toLowerCase())) ||
      /^\d+$/.test(cellText)
    );
  };
  return isPureIndexCell;
}
