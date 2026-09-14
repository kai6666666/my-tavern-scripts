// @ts-nocheck
/**
 * resolve-global-interaction-row-title.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createResolveGlobalInteractionRowTitle(deps: any) {
  const resolveGlobalInteractionRowTitle = (headers: unknown[], rowData: unknown[], rowIndex: number): string => {
    const exactNameColumnIndex = headers.findIndex(header => {
      const headerText = deps.normalizeGlobalInteractionHeader(header);
      return (
        Boolean(headerText) && deps.GLOBAL_INTERACTION_NAME_HEADERS.some(keyword => headerText === keyword.toLowerCase())
      );
    });
    const nameColumnIndex =
      exactNameColumnIndex >= 0 ? exactNameColumnIndex : headers.findIndex(deps.isLikelyGlobalInteractionNameHeader);
    const nameColumnText = nameColumnIndex >= 0 ? deps.getStringLikeCellText(rowData[nameColumnIndex]) : '';
    if (nameColumnText) return nameColumnText;

    const firstDescriptiveCell = rowData.find((cell, columnIndex) => {
      const cellText = deps.getStringLikeCellText(cell);
      return Boolean(cellText) && !deps.isPureIndexCell(headers, columnIndex, cell);
    });
    const descriptiveText = deps.getStringLikeCellText(firstDescriptiveCell);
    if (descriptiveText) return descriptiveText;

    const firstStringLikeCell = rowData.find(cell => Boolean(deps.getStringLikeCellText(cell)));
    const fallbackText = deps.getStringLikeCellText(firstStringLikeCell);
    return fallbackText || `第 ${rowIndex + 1} 行`;
  };
  return resolveGlobalInteractionRowTitle;
}
