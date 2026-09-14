// @ts-nocheck
/**
 * warn-table-template-issue.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createWarnTableTemplateIssue(deps: any) {
  const warnTableTemplateIssue = (message: string): void => {
    window.toastr?.warning(deps.withTableTemplateCheckHint(message));
  };
  return warnTableTemplateIssue;
}
