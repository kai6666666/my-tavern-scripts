// @ts-nocheck
/**
 * is-check-suggestion-outcome-success.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createIsCheckSuggestionOutcomeSuccess(deps: any) {
  const isCheckSuggestionOutcomeSuccess = (outcome: OutcomeLevel): boolean => {
    return (
      deps.getCheckSuggestionOutcomeResultType(outcome) === 'critSuccess' ||
      deps.getCheckSuggestionOutcomeResultType(outcome) === 'extremeSuccess' ||
      deps.getCheckSuggestionOutcomeResultType(outcome) === 'success'
    );
  };
  return isCheckSuggestionOutcomeSuccess;
}
