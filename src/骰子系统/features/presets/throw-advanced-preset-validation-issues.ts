// @ts-nocheck
/**
 * throw-advanced-preset-validation-issues.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createThrowAdvancedPresetValidationIssues(deps: any) {
  const throwAdvancedPresetValidationIssues = (issues: AdvancedPresetValidationIssue[]): void => {
    if (issues.length === 0) return;
    const summary = issues
      .slice(0, 5)
      .map(issue => `${issue.path}: ${issue.message}`)
      .join('；');
    const extra = issues.length > 5 ? `；另有 ${issues.length - 5} 个问题` : '';
    throw new Error(`预设校验失败：${summary}${extra}`);
  };
  return throwAdvancedPresetValidationIssues;
}
