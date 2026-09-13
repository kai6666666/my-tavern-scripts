// @ts-nocheck
/**
 * validate-advanced-preset-contest-rule.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createValidateAdvancedPresetContestRule(deps: any) {
  const validateAdvancedPresetContestRule = (
    preset: AdvancedDicePreset,
    issues: AdvancedPresetValidationIssue[],
  ): void => {
    if (preset.contestRule === undefined) return;
    if (!deps.isAdvancedPresetRecord(preset.contestRule)) {
      deps.pushAdvancedPresetIssue(issues, 'contestRule', '必须是对象');
      return;
    }

    const contestRule = preset.contestRule;
    const allowedModes = new Set(['rank', 'value', 'margin', 'custom']);
    const allowedKeys = new Set([
      'disabled',
      'mode',
      'tieBreakers',
      'tieBreaker',
      'customExpr',
      'hideDc',
      'hideMod',
      'hideSkillMod',
    ]);
    Object.keys(contestRule).forEach(key => {
      if (!allowedKeys.has(key)) {
        deps.pushAdvancedPresetIssue(issues, `contestRule.${key}`, '不是支持的对抗规则字段');
      }
    });
    if ('disabled' in contestRule && typeof contestRule.disabled !== 'boolean') {
      deps.pushAdvancedPresetIssue(issues, 'contestRule.disabled', '必须是布尔值');
    }
    if ('mode' in contestRule && (typeof contestRule.mode !== 'string' || !allowedModes.has(contestRule.mode))) {
      deps.pushAdvancedPresetIssue(issues, 'contestRule.mode', '必须是 rank/value/margin/custom 之一');
    }
    if ('tieBreakers' in contestRule) {
      if (!Array.isArray(contestRule.tieBreakers)) {
        deps.pushAdvancedPresetIssue(issues, 'contestRule.tieBreakers', '必须是字符串数组');
      } else if (contestRule.tieBreakers.some(item => typeof item !== 'string')) {
        deps.pushAdvancedPresetIssue(issues, 'contestRule.tieBreakers', '只能包含字符串');
      }
    }
    if ('tieBreaker' in contestRule && typeof contestRule.tieBreaker !== 'string') {
      deps.pushAdvancedPresetIssue(issues, 'contestRule.tieBreaker', '必须是字符串');
    }
    if ('customExpr' in contestRule) {
      if (typeof contestRule.customExpr !== 'string') {
        deps.pushAdvancedPresetIssue(issues, 'contestRule.customExpr', '必须是字符串');
      } else {
        const conditionResult = deps.evaluateCondition(contestRule.customExpr, {
          $initValue: 12,
          $oppValue: 10,
          $initRank: 60,
          $oppRank: 40,
        });
        if (!conditionResult.success) {
          deps.pushAdvancedPresetIssue(issues, 'contestRule.customExpr', conditionResult.error || '条件表达式无法解析');
        }
      }
    }
    (['hideDc', 'hideMod', 'hideSkillMod'] as const).forEach(key => {
      if (key in contestRule && typeof contestRule[key] !== 'boolean') {
        deps.pushAdvancedPresetIssue(issues, `contestRule.${key}`, '必须是布尔值');
      }
    });
  };
  return validateAdvancedPresetContestRule;
}
