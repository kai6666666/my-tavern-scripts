// @ts-nocheck
/**
 * execute-advanced-contest-check-suggestion.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createExecuteAdvancedContestCheckSuggestion(deps: any) {
  const executeAdvancedContestCheckSuggestion = (
    command: Extract<CheckSuggestionParsedCommand, { kind: 'contest' }>,
  ) => {
    deps.refreshNameAliasesForCheckSuggestion();
    const presetId = command.rawParams.preset || null;
    const preset = deps.getCheckSuggestionPresetById(presetId);
    if (!preset) throw new Error('未找到可用检定预设');
    if (!deps.AdvancedDicePresetManager.supportsContest(preset)) {
      throw new Error(`当前检定预设「${preset.name}」不支持对抗检定`);
    }
    const params = deps.normalizeCheckSuggestionParams(command.rawParams, preset);
    const leftName = deps.resolveCheckSuggestionCharacterName(command.leftName);
    const rightName = deps.resolveCheckSuggestionCharacterName(command.rightName);
    const leftParams = deps.buildCheckSuggestionSideParams(params, 'left');
    const rightParams = deps.buildCheckSuggestionSideParams(params, 'right');
    const left = deps.buildCheckSuggestionPresetSide(preset, {
      characterName: leftName,
      attributeName: command.leftAttribute,
      params: leftParams,
      diceExpression: command.hasExplicitDice ? command.diceType : undefined,
    });
    const right = deps.buildCheckSuggestionPresetSide(preset, {
      characterName: rightName,
      attributeName: command.rightAttribute,
      params: rightParams,
      diceExpression: command.hasExplicitDice ? command.diceType : undefined,
    });
    const winnerSide = deps.resolveCheckSuggestionContestWinner(preset, left, right, command);
    const leftDisplayName = deps.replaceUserPlaceholders(leftName);
    const rightDisplayName = deps.replaceUserPlaceholders(rightName);
    const winnerText =
      winnerSide === 'initiator'
        ? `${leftDisplayName} 胜利`
        : winnerSide === 'opponent'
          ? `${rightDisplayName} 胜利`
          : '平局';
    const leftTotal = left.rollTotal + left.attrMod + left.skillMod + left.mod;
    const rightTotal = right.rollTotal + right.attrMod + right.skillMod + right.mod;
    const margin = leftTotal - rightTotal;
    const signed = (value: number): string => (value >= 0 ? `+${value}` : String(value));
    const template = preset.contestOutputTemplate || deps.DEFAULT_CONTEST_OUTPUT_TEMPLATE;
    const initCheckValueText = deps.buildCheckValueText({
      preset,
      characterName: leftName,
      actionName: command.leftAttribute,
      attrValue: left.attrValue,
      attrMod: left.attrMod,
      skillMod: left.skillMod,
      mode: 'contest',
      attrNameOverride: deps.getNamedCheckParamText(leftParams.attr),
      skillNameOverride: deps.getNamedCheckParamText(leftParams.skillMod),
    });
    const oppCheckValueText = deps.buildCheckValueText({
      preset,
      characterName: rightName,
      actionName: command.rightAttribute,
      attrValue: right.attrValue,
      attrMod: right.attrMod,
      skillMod: right.skillMod,
      mode: 'contest',
      attrNameOverride: deps.getNamedCheckParamText(rightParams.attr),
      skillNameOverride: deps.getNamedCheckParamText(rightParams.skillMod),
    });
    const contestOutputContext: Record<string, string | number | undefined> = {
      initiator: leftName,
      opponent: rightName,
      initAttrName: command.leftAttribute,
      oppAttrName: command.rightAttribute,
      initRoll: left.rollTotal,
      oppRoll: right.rollTotal,
      initDisplayValue: left.displayValue,
      oppDisplayValue: right.displayValue,
      initTarget: left.dc,
      oppTarget: right.dc,
      initSuccessName: left.outcome.name,
      oppSuccessName: right.outcome.name,
      winner: winnerText,
      outcomeText: left.outcome.outputText || left.outcome.name || '判定完成',
      outcomeName: left.outcome.name,
      conditionExpr: left.conditionExpr,
      judgeResult: left.judgeResultText,
      formula: left.diceExpression,
      initFormula: left.diceExpression,
      oppFormula: right.diceExpression,
      roll: left.rollTotal,
      dc: left.dc,
      mod: left.mod,
      attr: left.attrValue,
      attrName: `【${command.leftAttribute}】`,
      initOutcomeText: left.outcome.outputText || left.outcome.name || '判定完成',
      oppOutcomeText: right.outcome.outputText || right.outcome.name || '判定完成',
      initConditionExpr: left.conditionExpr,
      oppConditionExpr: right.conditionExpr,
      initJudgeResult: left.judgeResultText,
      oppJudgeResult: right.judgeResultText,
      initAttrMod: left.attrMod,
      oppAttrMod: right.attrMod,
      initSkillMod: left.skillMod,
      oppSkillMod: right.skillMod,
      initMod: left.mod,
      oppMod: right.mod,
      initAttrModText: left.attrMod !== 0 ? `，调整值${signed(left.attrMod)}` : '',
      oppAttrModText: right.attrMod !== 0 ? `，调整值${signed(right.attrMod)}` : '',
      initSkillModText: left.skillMod !== 0 ? `+技能加值${signed(left.skillMod)}` : '',
      oppSkillModText: right.skillMod !== 0 ? `+技能加值${signed(right.skillMod)}` : '',
      initModText: left.mod !== 0 ? `+额外加值${signed(left.mod)}` : '',
      oppModText: right.mod !== 0 ? `+额外加值${signed(right.mod)}` : '',
      initCheckValueText,
      oppCheckValueText,
      initTotal: leftTotal,
      oppTotal: rightTotal,
      margin,
      shifts: margin,
      initAttr: left.attrValue,
      oppAttr: right.attrValue,
    };
    const contestResultText = deps.formatOutputTemplate(template, contestOutputContext);
    deps.smartInsertToTextarea(contestResultText, 'dice');

    const contestResult: AcuDice.ContestResult = {
      left: {
        name: leftName,
        attribute: command.leftAttribute,
        roll: left.rollTotal,
        target: left.dc || left.attrValue,
        successLevel: left.outcome.contestRank ?? 0,
      },
      right: {
        name: rightName,
        attribute: command.rightAttribute,
        roll: right.rollTotal,
        target: right.dc || right.attrValue,
        successLevel: right.outcome.contestRank ?? 0,
      },
      winner: winnerSide === 'initiator' ? 'left' : winnerSide === 'opponent' ? 'right' : 'tie',
      message: winnerText,
    };
    const timestamp = Date.now();
    const contestResultWithTimestamp = {
      ...contestResult,
      timestamp,
      detailId: `contest_${timestamp}_${Math.random().toString(36).slice(2, 8)}`,
      historyType: 'contest' as const,
      detailLines: [
        `发起方: ${leftDisplayName} / 对抗方: ${rightDisplayName}`,
        `属性: ${command.leftAttribute} vs ${command.rightAttribute}`,
        `预设: ${preset.name}`,
        `公式: ${left.diceExpression} vs ${right.diceExpression}`,
        `掷骰: ${left.rollTotal} vs ${right.rollTotal}`,
        `总值: ${leftTotal} vs ${rightTotal}`,
        `判定: ${left.conditionExpr} | ${right.conditionExpr}`,
        `结果: ${winnerText}`,
      ],
    };
    deps.getContestHistory().push(contestResultWithTimestamp);
    if (deps.getContestHistory().length > deps.getMAX_HISTORY()) deps.getContestHistory().shift();
    deps.emitEvent('contest', contestResultWithTimestamp);
  };
  return executeAdvancedContestCheckSuggestion;
}
