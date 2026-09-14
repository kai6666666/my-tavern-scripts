// @ts-nocheck
/**
 * error-table-template-issue.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { showActionableErrorToast } from '../../shared/actionable-error-toast';
export function createErrorTableTemplateIssue(deps: any) {
  const errorTableTemplateIssue = (message: string): void => {
    showActionableErrorToast(message, { suggestion: 'tableTemplate' });
  };
  return errorTableTemplateIssue;
}
