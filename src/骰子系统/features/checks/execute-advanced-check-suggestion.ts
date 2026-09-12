// @ts-nocheck
/**
 * execute-advanced-check-suggestion.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { computePendingEffectVariables } from '../../shared/effect-math';
export function createExecuteAdvancedCheckSuggestion(deps: any) {
  const executeAdvancedCheckSuggestion = (command: Extract<CheckSuggestionParsedCommand, { kind: 'check' }>) => {
    deps.refreshNameAliasesForCheckSuggestion();
    const presetId = command.rawParams.preset || null;
    const preset = deps.getCheckSuggestionPresetById(presetId);
    if (!preset) throw new Error('未找到可用检定预设');
    const params = deps.normalizeCheckSuggestionParams(command.rawParams, preset);
    const characterName = deps.resolveCheckSuggestionCharacterName(command.characterName);
    const side = deps.buildCheckSuggestionPresetSide(preset, {
      characterName,
      attributeName: command.attributeName,
      params,
      targetValue: command.targetValue,
      diceExpression: command.hasExplicitDice ? command.diceType : undefined,
    });
    const outcomeText = side.outcome.name || '判定完成';
    const outcomeTextRaw = side.outcome.outputText || '';
    const attrModStr = side.attrMod >= 0 ? `+${side.attrMod}` : String(side.attrMod);
    const skillModStr = side.skillMod >= 0 ? `+${side.skillMod}` : String(side.skillMod);
    const skillModText = side.skillMod !== 0 ? `+技能加值${skillModStr}` : '';
    const modText = side.mod !== 0 ? `+额外加值${side.mod >= 0 ? '+' + side.mod : side.mod}` : '';
    const attrModText = side.attrMod !== 0 ? `(调整值${attrModStr})` : '';
    const effectVars = computePendingEffectVariables(side.outcome.effects);
    const checkValueText = deps.buildCheckValueText({
      preset,
      characterName,
      actionName: command.attributeName,
      attrValue: side.attrValue,
      attrMod: side.attrMod,
      skillMod: side.skillMod,
      mode: 'normal',
      attrNameOverride: deps.getNamedCheckParamText(params.attr),
      skillNameOverride: deps.getNamedCheckParamText(params.skillMod),
    });
    const outputContext: Record<string, string | number | undefined> = {
      initiator: characterName,
      attrName: `【${command.attributeName}】`,
      attrValue: side.attrValue,
      attrMod: attrModStr,
      displayValue: side.displayValue,
      skillMod: skillModStr,
      skillModText,
      modText,
      attrModText,
      checkValueText,
      formula: side.diceExpression,
      roll: side.rollTotal,
      'roll.total': side.rollTotal,
      dc: side.dc,
      mod: side.mod,
      attr: side.attrValue,
      conditionExpr: side.conditionExpr,
      judgeResult: side.judgeResultText,
      outcomeName: outcomeText,
      outcomeText: outcomeTextRaw,
      ...(side.outputVars as Record<string, string | number>),
      ...(effectVars as Record<string, string | number>),
    };
    outputContext.outcomeText = deps.formatOutputTemplate(String(outputContext.outcomeText || ''), outputContext);
    const template = preset.outputTemplate || deps.DEFAULT_OUTPUT_TEMPLATE;
    const diceResultText = deps.formatOutputTemplate(template, outputContext);
    deps.smartInsertToTextarea(diceResultText, 'dice');

    const isSuccess = deps.isCheckSuggestionOutcomeSuccess(side.outcome);
    const checkResult: AcuDice.CheckResult = {
      success: isSuccess,
      total: side.rollTotal,
      target: side.dc || side.attrValue,
      outcomeText,
      attrName: command.attributeName,
      criteria: 'advanced',
      isAutoTarget: command.targetValue === null && params.attr === undefined,
      formula: side.diceExpression,
    };
    const detailId = `check_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const checkResultWithTimestamp = {
      ...checkResult,
      timestamp: Date.now(),
      detailId,
      initiatorName: characterName,
      historyType: 'check' as const,
      detailLines: [
        `发起者: ${deps.replaceUserPlaceholders(characterName)}`,
        `属性: ${command.attributeName} (值=${side.attrValue})`,
        `预设: ${preset.name}`,
        `公式: ${side.diceExpression}`,
        `掷骰: ${side.rollTotal}`,
        `目标: ${side.dc || side.attrValue}`,
        `修正: attrMod=${attrModStr}, skillMod=${skillModStr}, mod=${side.mod >= 0 ? '+' + side.mod : side.mod}`,
        `判定: ${side.conditionExpr}`,
        `结果: ${outcomeText}`,
      ],
    };
    deps.checkHistory.push(checkResultWithTimestamp);
    if (deps.checkHistory.length > deps.MAX_HISTORY) deps.checkHistory.shift();
    deps.emitEvent('check', checkResultWithTimestamp);
  };
  return executeAdvancedCheckSuggestion;
}
