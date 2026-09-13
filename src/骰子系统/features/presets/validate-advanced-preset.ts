// @ts-nocheck
/**
 * validate-advanced-preset.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { rollComplexDiceExpression } from '../../features/dice/dice-engine';
export function createValidateAdvancedPreset(deps: any) {
  const validateAdvancedPreset = (
    preset: AdvancedDicePreset,
    tests: AdvancedPresetAgentTestCase[],
    options: { requireMetaWrapper?: boolean } = {},
  ): AdvancedPresetValidationIssue[] => {
    const issues: AdvancedPresetValidationIssue[] = [];
    if (preset.kind !== 'advanced') {
      deps.pushAdvancedPresetIssue(issues, 'kind', '必须是 "advanced"');
    }
    if (!preset.name || typeof preset.name !== 'string') {
      deps.pushAdvancedPresetIssue(issues, 'name', '必须是非空字符串');
    }
    if (!preset.diceExpression || typeof preset.diceExpression !== 'string') {
      deps.pushAdvancedPresetIssue(issues, 'diceExpression', '必须是非空字符串');
    } else {
      const rollResult = rollComplexDiceExpression(preset.diceExpression);
      if (Number.isNaN(rollResult.total)) {
        deps.pushAdvancedPresetIssue(issues, 'diceExpression', '骰子表达式无法解析');
      }
    }
    deps.validateAdvancedPresetFieldConfig(preset.attribute, 'attribute', issues, { allowKey: true });
    deps.validateAdvancedPresetFieldConfig(preset.dc, 'dc', issues);
    if (preset.mod !== undefined) deps.validateAdvancedPresetFieldConfig(preset.mod, 'mod', issues);
    if (preset.skillMod !== undefined) deps.validateAdvancedPresetFieldConfig(preset.skillMod, 'skillMod', issues);
    deps.validateAdvancedPresetCustomFields(preset, issues);
    deps.validateAdvancedPresetDicePatches(preset, issues);
    deps.validateAdvancedPresetContestRule(preset, issues);
    deps.validateAdvancedPresetOutcomes(preset, issues);
    deps.validateAdvancedPresetOutcomePolicy(preset, issues);
    deps.validateAdvancedPresetTemplates(preset, issues, { requireMetaWrapper: Boolean(options.requireMetaWrapper) });
    if (issues.length === 0 && tests.length > 0) {
      deps.validateAdvancedPresetAgentTests(preset, tests, issues);
    }
    deps.throwAdvancedPresetValidationIssues(issues);
    return issues;
  };
  return validateAdvancedPreset;
}
