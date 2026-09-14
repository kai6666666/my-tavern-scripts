// @ts-nocheck
/**
 * validate-advanced-preset-agent-tests.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createValidateAdvancedPresetAgentTests(deps: any) {
  const validateAdvancedPresetAgentTests = (
    preset: AdvancedDicePreset,
    tests: AdvancedPresetAgentTestCase[],
    issues: AdvancedPresetValidationIssue[],
  ): void => {
    tests.forEach((test, index) => {
      const context = deps.buildAdvancedPresetEvaluationContext(preset, test.context);
      const baseOutcome = deps.evaluateOutcomes(preset.outcomes, context as Record<string, number>);
      const matchedOutcome = deps.applyAdvancedPresetOutcomePolicy(preset, baseOutcome, context).outcome;
      const expectedId = test.expectedOutcomeId?.trim();
      const expectedName = test.expectedOutcomeName?.trim();
      if (expectedId && matchedOutcome.id !== expectedId) {
        deps.pushAdvancedPresetIssue(
          issues,
          `tests[${index}]`,
          `期望 outcome id 为 "${expectedId}"，实际为 "${matchedOutcome.id}"`,
        );
      }
      if (expectedName && matchedOutcome.name !== expectedName) {
        deps.pushAdvancedPresetIssue(
          issues,
          `tests[${index}]`,
          `期望 outcome name 为 "${expectedName}"，实际为 "${matchedOutcome.name}"`,
        );
      }
    });
  };
  return validateAdvancedPresetAgentTests;
}
