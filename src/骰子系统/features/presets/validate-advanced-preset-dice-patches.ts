// @ts-nocheck
/**
 * validate-advanced-preset-dice-patches.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createValidateAdvancedPresetDicePatches(deps: any) {
  const validateAdvancedPresetDicePatches = (
    preset: AdvancedDicePreset,
    issues: AdvancedPresetValidationIssue[],
  ): void => {
    if (preset.dicePatches === undefined) return;
    if (!Array.isArray(preset.dicePatches)) {
      deps.pushAdvancedPresetIssue(issues, 'dicePatches', '必须是数组');
      return;
    }

    const allowedOps = new Set(['append', 'prepend', 'replace']);
    const context = deps.buildAdvancedPresetEvaluationContext(preset);
    preset.dicePatches.forEach((patch, index) => {
      const path = `dicePatches[${index}]`;
      if (!deps.isAdvancedPresetRecord(patch)) {
        deps.pushAdvancedPresetIssue(issues, path, '必须是对象');
        return;
      }
      if (typeof patch.op !== 'string' || !allowedOps.has(patch.op)) {
        deps.pushAdvancedPresetIssue(issues, `${path}.op`, '必须是 append/prepend/replace 之一');
      }
      if (typeof patch.template !== 'string' || !patch.template.trim()) {
        deps.pushAdvancedPresetIssue(issues, `${path}.template`, '必须是非空字符串');
      }
      if ('when' in patch) {
        if (typeof patch.when !== 'string') {
          deps.pushAdvancedPresetIssue(issues, `${path}.when`, '必须是字符串');
        } else {
          const conditionResult = deps.evaluateCondition(patch.when, context as Record<string, number>);
          if (!conditionResult.success) {
            deps.pushAdvancedPresetIssue(issues, `${path}.when`, conditionResult.error || '条件表达式无法解析');
          }
        }
      }
    });
  };
  return validateAdvancedPresetDicePatches;
}
