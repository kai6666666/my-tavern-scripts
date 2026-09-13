// @ts-nocheck
/**
 * execute-fixed-check-suggestion.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createExecuteFixedCheckSuggestion(deps: any) {
  const executeFixedCheckSuggestion = (success: boolean) => {
    const label = success ? '必定成功' : '必定失败';
    deps.smartInsertToTextarea(deps.buildCheckSuggestionMetaBlock(`元叙事：无需投骰，【${label}】。`), 'dice');
  };
  return executeFixedCheckSuggestion;
}
