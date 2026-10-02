/**
 * apply-advanced-preset-outcome-policy.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { RollResult } from '../../shared/types';
type AdvancedDicePreset = Record<string, any>;
type AdvancedPresetOutcomePolicyResult = Record<string, any>;

import type { OutcomeLevel } from '../../shared/advanced-preset-types';
export function createApplyAdvancedPresetOutcomePolicy(deps: any) {
  const applyAdvancedPresetOutcomePolicy = (
    preset: AdvancedDicePreset,
    matchedOutcome: OutcomeLevel,
    context: Record<string, string | number | boolean | RollResult>,
  ): AdvancedPresetOutcomePolicyResult => {
    let outcome = matchedOutcome;
    let requiredOutcome: OutcomeLevel | undefined;

    if (preset.outcomePolicy?.kind === 'minRank') {
      const requiredRankVarId = preset.outcomePolicy.requiredRankVarId;
      const varKey = requiredRankVarId.startsWith('$') ? requiredRankVarId : `$${requiredRankVarId}`;
      const requiredRank = deps.readAdvancedPresetPolicyNumber(context, varKey, 0);
      const actualRank = (matchedOutcome as any).rank ?? 0;

      if (requiredRank > 0) {
        requiredOutcome = preset.outcomes.find((candidate: any) => candidate.rank === requiredRank);
      }

      if (Number.isFinite(requiredRank) && actualRank >= 1 && actualRank < requiredRank) {
        const fallbackOutcome = preset.outcomes.find(
          (candidate: any) => candidate.id === preset.outcomePolicy?.unmetOutcomeId,
        );
        if (fallbackOutcome) outcome = fallbackOutcome;
      }
    }

    return {
      outcome,
      requiredOutcome,
      isUnmet: outcome !== matchedOutcome,
    };
  };
  return applyAdvancedPresetOutcomePolicy;
}
