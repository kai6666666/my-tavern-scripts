// @ts-nocheck
/**
 * get-check-suggestion-outcome-result-type.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetCheckSuggestionOutcomeResultType(deps: any) {
  const getCheckSuggestionOutcomeResultType = (outcome: OutcomeLevel): string => {
    if (outcome.priority <= 10) return 'critSuccess';
    if (outcome.priority <= 30) return 'extremeSuccess';
    if (outcome.priority < 50) return 'success';
    if (outcome.priority === 50) return 'warning';
    if (outcome.priority < 90) return 'failure';
    return 'critFailure';
  };
  return getCheckSuggestionOutcomeResultType;
}
