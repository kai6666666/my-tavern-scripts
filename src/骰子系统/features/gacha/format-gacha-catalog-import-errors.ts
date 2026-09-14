// @ts-nocheck
/**
 * format-gacha-catalog-import-errors.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createFormatGachaCatalogImportErrors(deps: any) {
  const formatGachaCatalogImportErrors = (errors: readonly string[], limit = 6): string => {
    if (!errors.length) return '';
    const visibleErrors = errors.slice(0, limit).join('；');
    return errors.length > limit ? `${visibleErrors}；还有 ${errors.length - limit} 项错误未显示` : visibleErrors;
  };
  return formatGachaCatalogImportErrors;
}
