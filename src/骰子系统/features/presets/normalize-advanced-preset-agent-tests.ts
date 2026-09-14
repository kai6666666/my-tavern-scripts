// @ts-nocheck
/**
 * normalize-advanced-preset-agent-tests.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createNormalizeAdvancedPresetAgentTests(deps: any) {
  const normalizeAdvancedPresetAgentTests = (rawTests: unknown): AdvancedPresetAgentTestCase[] => {
    if (rawTests === undefined) return [];
    if (!Array.isArray(rawTests)) {
      throw new Error('tests 必须是数组');
    }

    return rawTests.map((rawTest, index) => {
      if (!deps.isAdvancedPresetRecord(rawTest)) {
        throw new Error(`tests[${index}] 必须是对象`);
      }

      const context = rawTest.context;
      const expectedOutcomeId = rawTest.expectedOutcomeId;
      const expectedOutcomeName = rawTest.expectedOutcomeName;
      const normalizedExpectedOutcomeId = typeof expectedOutcomeId === 'string' ? expectedOutcomeId.trim() : '';
      const normalizedExpectedOutcomeName = typeof expectedOutcomeName === 'string' ? expectedOutcomeName.trim() : '';
      if (context !== undefined && !deps.isAdvancedPresetRecord(context)) {
        throw new Error(`tests[${index}].context 必须是对象`);
      }
      if (expectedOutcomeId !== undefined && typeof expectedOutcomeId !== 'string') {
        throw new Error(`tests[${index}].expectedOutcomeId 必须是字符串`);
      }
      if (expectedOutcomeName !== undefined && typeof expectedOutcomeName !== 'string') {
        throw new Error(`tests[${index}].expectedOutcomeName 必须是字符串`);
      }
      if (!normalizedExpectedOutcomeId && !normalizedExpectedOutcomeName) {
        throw new Error(`tests[${index}] 至少需要 expectedOutcomeId 或 expectedOutcomeName`);
      }

      return {
        ...(typeof rawTest.name === 'string' && rawTest.name.trim() ? { name: rawTest.name.trim() } : {}),
        ...(deps.isAdvancedPresetRecord(context) ? { context } : {}),
        ...(normalizedExpectedOutcomeId ? { expectedOutcomeId: normalizedExpectedOutcomeId } : {}),
        ...(normalizedExpectedOutcomeName ? { expectedOutcomeName: normalizedExpectedOutcomeName } : {}),
      };
    });
  };
  return normalizeAdvancedPresetAgentTests;
}
