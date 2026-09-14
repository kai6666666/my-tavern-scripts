// @ts-nocheck
/**
 * resolve-check-suggestion-contest-winner.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createResolveCheckSuggestionContestWinner(deps: any) {
  const resolveCheckSuggestionContestWinner = (
    preset: AdvancedDicePreset,
    left: CheckSuggestionPresetSideResult,
    right: CheckSuggestionPresetSideResult,
    command: Extract<CheckSuggestionParsedCommand, { kind: 'contest' }>,
  ): 'initiator' | 'opponent' | 'tie' => {
    const contestRule = preset.contestRule;
    let winner: 'initiator' | 'opponent' | 'tie' = 'tie';
    const leftTotal = left.rollTotal + left.attrMod + left.skillMod + left.mod;
    const rightTotal = right.rollTotal + right.attrMod + right.skillMod + right.mod;

    switch (contestRule?.mode ?? 'rank') {
      case 'rank': {
        const leftRank = left.outcome.contestRank ?? 50;
        const rightRank = right.outcome.contestRank ?? 50;
        if (leftRank > rightRank) winner = 'initiator';
        else if (rightRank > leftRank) winner = 'opponent';
        break;
      }
      case 'value':
      case 'margin': {
        if (leftTotal > rightTotal) winner = 'initiator';
        else if (rightTotal > leftTotal) winner = 'opponent';
        break;
      }
      case 'custom': {
        if (contestRule?.customExpr) {
          const conditionResult = deps.evaluateCondition(contestRule.customExpr, {
            $initValue: leftTotal,
            $oppValue: rightTotal,
            $initRank: left.outcome.contestRank ?? 50,
            $oppRank: right.outcome.contestRank ?? 50,
          });
          if (conditionResult.success) {
            const matched =
              typeof conditionResult.value === 'number' ? conditionResult.value !== 0 : Boolean(conditionResult.value);
            winner = matched ? 'initiator' : 'opponent';
          }
        }
        break;
      }
    }

    if (winner === 'tie' && command.hasExplicitTieRule) {
      if (command.tieRule === 'initiator_win') return 'initiator';
      if (command.tieRule === 'initiator_lose') return 'opponent';
      return 'tie';
    }

    const tieBreakers =
      Array.isArray(contestRule?.tieBreakers) && contestRule.tieBreakers.length > 0
        ? contestRule.tieBreakers
        : contestRule?.tieBreaker
          ? [contestRule.tieBreaker]
          : [];
    if (winner === 'tie') {
      for (const tieBreaker of tieBreakers) {
        if (tieBreaker === 'higher_attr') {
          if (left.attrValue > right.attrValue) winner = 'initiator';
          else if (right.attrValue > left.attrValue) winner = 'opponent';
        } else if (tieBreaker === 'higher_roll') {
          if (left.rollTotal > right.rollTotal) winner = 'initiator';
          else if (right.rollTotal > left.rollTotal) winner = 'opponent';
        } else if (tieBreaker === 'initiator_wins') {
          winner = 'initiator';
        } else if (tieBreaker === 'status_quo') {
          winner = 'tie';
        }
        if (winner !== 'tie') break;
      }
    }
    return winner;
  };
  return resolveCheckSuggestionContestWinner;
}
