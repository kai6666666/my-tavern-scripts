// @ts-nocheck
/**
 * push-advanced-preset-issue.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createPushAdvancedPresetIssue(deps: any) {
  const pushAdvancedPresetIssue = (issues: AdvancedPresetValidationIssue[], path: string, message: string): void => {
    issues.push({ path, message });
  };
  return pushAdvancedPresetIssue;
}
