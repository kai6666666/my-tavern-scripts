// @ts-nocheck
/**
 * validate-advanced-preset-outcomes.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createValidateAdvancedPresetOutcomes(deps: any) {
  const validateAdvancedPresetOutcomes = (
    preset: AdvancedDicePreset,
    issues: AdvancedPresetValidationIssue[],
  ): void => {
    if (!Array.isArray(preset.outcomes) || preset.outcomes.length === 0) {
      deps.pushAdvancedPresetIssue(issues, 'outcomes', '至少需要一个判定结果');
      return;
    }

    const ids = new Set<string>();
    const smokeContext = deps.buildAdvancedPresetEvaluationContext(preset);
    preset.outcomes.forEach((outcome, index) => {
      const path = `outcomes[${index}]`;
      if (!deps.isAdvancedPresetRecord(outcome)) {
        deps.pushAdvancedPresetIssue(issues, path, '必须是对象');
        return;
      }
      if (typeof outcome.id !== 'string' || !outcome.id.trim()) {
        deps.pushAdvancedPresetIssue(issues, `${path}.id`, '必须是非空字符串');
      } else if (ids.has(outcome.id)) {
        deps.pushAdvancedPresetIssue(issues, `${path}.id`, `重复的 outcome ID: ${outcome.id}`);
      } else {
        ids.add(outcome.id);
      }
      if (typeof outcome.name !== 'string' || !outcome.name.trim()) {
        deps.pushAdvancedPresetIssue(issues, `${path}.name`, '必须是非空字符串');
      }
      if (typeof outcome.condition !== 'string') {
        deps.pushAdvancedPresetIssue(issues, `${path}.condition`, '必须是字符串');
      } else {
        const conditionResult = deps.evaluateCondition(outcome.condition, smokeContext as Record<string, number>);
        if (!conditionResult.success) {
          deps.pushAdvancedPresetIssue(issues, `${path}.condition`, conditionResult.error || '条件表达式无法解析');
        }
      }
      if ('displayExpr' in outcome) {
        if (typeof outcome.displayExpr !== 'string') {
          deps.pushAdvancedPresetIssue(issues, `${path}.displayExpr`, '必须是字符串');
        } else {
          const displayExprResult = deps.evaluateCondition(outcome.displayExpr, smokeContext as Record<string, number>);
          if (!displayExprResult.success) {
            deps.pushAdvancedPresetIssue(issues, `${path}.displayExpr`, displayExprResult.error || '显示表达式无法解析');
          }
        }
      }
      if (typeof outcome.priority !== 'number' || !Number.isFinite(outcome.priority)) {
        deps.pushAdvancedPresetIssue(issues, `${path}.priority`, '必须是数字');
      }
      if ('rank' in outcome && typeof outcome.rank !== 'number') {
        deps.pushAdvancedPresetIssue(issues, `${path}.rank`, '必须是数字');
      }
      if ('contestRank' in outcome && typeof outcome.contestRank !== 'number') {
        deps.pushAdvancedPresetIssue(issues, `${path}.contestRank`, '必须是数字');
      }
    });
  };
  return validateAdvancedPresetOutcomes;
}
