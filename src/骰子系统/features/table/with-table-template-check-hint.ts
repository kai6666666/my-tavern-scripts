// @ts-nocheck
/**
 * with-table-template-check-hint.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createWithTableTemplateCheckHint(deps: any) {
  const withTableTemplateCheckHint = (message: string): string => {
    const text = String(message || '').trim();
    if (!text) return deps.getTABLE_TEMPLATE_CHECK_HINT();
    if (text.includes('检验表格模板')) return text;
    const separator = /[。！？!?]$/.test(text) ? '' : '。';
    return `${text}${separator}${deps.getTABLE_TEMPLATE_CHECK_HINT()}`;
  };
  return withTableTemplateCheckHint;
}
