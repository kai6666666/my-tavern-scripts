// @ts-nocheck
/**
 * get-custom-table-name-icon-pack-import-summary-text.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetCustomTableNameIconPackImportSummaryText(deps: any) {
  const getCustomTableNameIconPackImportSummaryText = (analysis: CustomTableNameIconPackImportAnalysis): string => {
    const lines = [
      `将导入 ${analysis.importedCount} 条图标映射。`,
      `覆盖现有映射：${analysis.overwrittenCount}`,
      `导入后需重传的本地图标：${analysis.localMissingCount}`,
      `跳过无效 URL：${analysis.skippedInvalidUrlCount}`,
      `跳过非白名单上下文：${analysis.skippedNonWhitelistCount}`,
    ];
    if (analysis.skippedInvalidEntryCount > 0) {
      lines.push(`跳过格式无效条目：${analysis.skippedInvalidEntryCount}`);
    }
    return lines.join('\n');
  };
  return getCustomTableNameIconPackImportSummaryText;
}
