// @ts-nocheck
/**
 * validate-advanced-preset-outcome-policy.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createValidateAdvancedPresetOutcomePolicy(deps: any) {
  const validateAdvancedPresetOutcomePolicy = (
    preset: AdvancedDicePreset,
    issues: AdvancedPresetValidationIssue[],
  ): void => {
    if (preset.outcomePolicy === undefined) return;
    if (!deps.isAdvancedPresetRecord(preset.outcomePolicy)) {
      deps.pushAdvancedPresetIssue(issues, 'outcomePolicy', '必须是对象');
      return;
    }

    const policy = preset.outcomePolicy;
    if (policy.kind !== 'minRank') {
      deps.pushAdvancedPresetIssue(issues, 'outcomePolicy.kind', '当前仅支持 minRank；conditional 是保留类型，不要生成');
      return;
    }

    if (typeof policy.requiredRankVarId !== 'string' || !policy.requiredRankVarId.trim()) {
      deps.pushAdvancedPresetIssue(issues, 'outcomePolicy.requiredRankVarId', '必须是 customFields 里的字段 ID');
    } else {
      const fieldId = policy.requiredRankVarId.startsWith('$')
        ? policy.requiredRankVarId.slice(1)
        : policy.requiredRankVarId;
      const fieldIndex = Array.isArray(preset.customFields)
        ? preset.customFields.findIndex(candidate => candidate.id === fieldId)
        : -1;
      const field = fieldIndex >= 0 && Array.isArray(preset.customFields) ? preset.customFields[fieldIndex] : undefined;
      const fieldPath = fieldIndex >= 0 ? `customFields[${fieldIndex}]` : `customFields.${fieldId}`;
      if (!field) {
        deps.pushAdvancedPresetIssue(issues, 'outcomePolicy.requiredRankVarId', `找不到自定义字段: ${fieldId}`);
      } else if (field.type !== 'number' && field.type !== 'select') {
        deps.pushAdvancedPresetIssue(issues, 'outcomePolicy.requiredRankVarId', '必须指向 number 字段或数值型 select 字段');
      } else if (field.type === 'select') {
        if (!Array.isArray(field.options) || field.options.length === 0) {
          deps.pushAdvancedPresetIssue(issues, `${fieldPath}.options`, 'minRank 使用的 select 必须提供数值选项');
        } else if (field.options.some(option => !deps.isAdvancedPresetNumericLike(option.value))) {
          deps.pushAdvancedPresetIssue(issues, `${fieldPath}.options`, 'minRank 使用的 select 选项 value 必须是数字');
        }
        if (!deps.isAdvancedPresetNumericLike(field.defaultValue)) {
          deps.pushAdvancedPresetIssue(issues, `${fieldPath}.defaultValue`, 'minRank 使用的 select 默认值必须是数字');
        }
      }
    }

    if (typeof policy.unmetOutcomeId !== 'string' || !policy.unmetOutcomeId.trim()) {
      deps.pushAdvancedPresetIssue(issues, 'outcomePolicy.unmetOutcomeId', '必须是 outcomes 里的 outcome ID');
    } else if (!preset.outcomes.some(outcome => outcome.id === policy.unmetOutcomeId)) {
      deps.pushAdvancedPresetIssue(issues, 'outcomePolicy.unmetOutcomeId', `找不到 outcome: ${policy.unmetOutcomeId}`);
    }

    if ('keepActualOutcome' in policy && typeof policy.keepActualOutcome !== 'boolean') {
      deps.pushAdvancedPresetIssue(issues, 'outcomePolicy.keepActualOutcome', '必须是布尔值');
    }

    if (!preset.outcomes.some(outcome => typeof outcome.rank === 'number')) {
      deps.pushAdvancedPresetIssue(issues, 'outcomes', '使用 minRank 时，参与成功等级比较的 outcomes 需要提供数字 rank');
    }
  };
  return validateAdvancedPresetOutcomePolicy;
}
