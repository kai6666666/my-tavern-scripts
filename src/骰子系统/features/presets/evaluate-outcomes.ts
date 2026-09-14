// @ts-nocheck
/**
 * evaluate-outcomes.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createEvaluateOutcomes(deps: any) {
  const evaluateOutcomes = (outcomes: OutcomeLevel[], context: Record<string, number>) => {
    if (!outcomes || outcomes.length === 0) {
      console.warn('[DICE] outcomes 数组为空,使用默认判定');
      return { id: 'default', name: '判定结果', condition: 'true', priority: 99 };
    }
    const sorted = [...outcomes].sort((a, b) => a.priority - b.priority);

    for (const outcome of sorted) {
      try {
        const conditionResult: { success: boolean; value?: number | boolean; error?: string } = deps.evaluateCondition(
          outcome.condition,
          context,
        );
        if (!conditionResult.success) {
          if (conditionResult.error) {
            console.warn(`[DICE] outcome "${outcome.name}" 条件评估失败:`, conditionResult.error);
          }
          continue;
        }
        const isMatch =
          typeof conditionResult.value === 'number' ? conditionResult.value !== 0 : Boolean(conditionResult.value);
        if (isMatch) {
          return outcome;
        }
      } catch (error) {
        console.warn(`[DICE] outcome "${outcome.name}" 条件评估失败:`, error);
        continue;
      }
    }

    return sorted[sorted.length - 1];
  };
  return evaluateOutcomes;
}
