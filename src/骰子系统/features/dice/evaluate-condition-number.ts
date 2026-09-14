// @ts-nocheck
/**
 * evaluate-condition-number.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createEvaluateConditionNumber(deps: any) {
  const evaluateConditionNumber = (formula: string, context: Record<string, number>, fallback = 0): number => {
    const result = deps.evaluateCondition(formula, context);
    if (!result.success) return fallback;
    if (typeof result.value === 'number' && Number.isFinite(result.value)) return result.value;
    return result.value ? 1 : 0;
  };
  return evaluateConditionNumber;
}
