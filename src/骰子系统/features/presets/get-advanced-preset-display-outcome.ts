// @ts-nocheck
/**
 * get-advanced-preset-display-outcome.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetAdvancedPresetDisplayOutcome(deps: any) {
  const getAdvancedPresetDisplayOutcome = (policyResult: AdvancedPresetOutcomePolicyResult): OutcomeLevel =>
    policyResult.isUnmet && policyResult.requiredOutcome ? policyResult.requiredOutcome : policyResult.outcome;
  return getAdvancedPresetDisplayOutcome;
}
