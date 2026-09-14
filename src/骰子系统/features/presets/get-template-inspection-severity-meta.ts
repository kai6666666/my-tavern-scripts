// @ts-nocheck
/**
 * get-template-inspection-severity-meta.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetTemplateInspectionSeverityMeta(deps: any) {
  const getTemplateInspectionSeverityMeta = (
    severity: TemplateInspectionSeverity,
  ): { label: string; icon: string; color: string } => {
    if (severity === 'error') return { label: '严重', icon: 'fa-circle-xmark', color: 'var(--acu-error-text)' };
    if (severity === 'warning')
      return { label: '警告', icon: 'fa-triangle-exclamation', color: 'var(--acu-warning-text)' };
    return { label: '提示', icon: 'fa-circle-info', color: 'var(--acu-hl-diff)' };
  };
  return getTemplateInspectionSeverityMeta;
}
