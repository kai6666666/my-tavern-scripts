// @ts-nocheck
/**
 * execute-normal-check-suggestion.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { rollComplexDiceExpression } from '../dice/dice-engine';
export function createExecuteNormalCheckSuggestion(deps: any) {
  const executeNormalCheckSuggestion = (command: Extract<CheckSuggestionParsedCommand, { kind: 'check' }>) => {
    deps.refreshNameAliasesForCheckSuggestion();
    const characterName = deps.resolveCheckSuggestionCharacterName(command.characterName);
    const targetValue = command.targetValue ?? deps.getAttributeValue(characterName, command.attributeName);
    if (targetValue === null) {
      throw new Error(`未找到 ${deps.replaceUserPlaceholders(characterName)} 的属性「${command.attributeName}」`);
    }

    const rollResult = rollComplexDiceExpression(command.diceType);
    if (Number.isNaN(rollResult.total)) {
      throw new Error(`无效的骰子公式：${command.diceType}`);
    }

    const sides = deps.getCheckSuggestionDiceSides(command.diceType);
    const finalRoll = rollResult.total;
    const successLevel = deps.getSuccessLevel(finalRoll, targetValue, sides);
    const success = command.criteria === 'gte' ? finalRoll >= targetValue : successLevel.level >= 0;
    const outcomeText = command.criteria === 'gte' ? (success ? '成功' : '失败') : successLevel.name;
    const judgeExpr = command.criteria === 'gte' ? `需≥${targetValue}` : `需≤${targetValue}`;
    const displayName = deps.replaceUserPlaceholders(characterName);
    const metaContent = `元叙事：${displayName}发起了【${command.attributeName}】检定，${command.diceType}=${finalRoll}，${judgeExpr}，【${outcomeText}】。`;
    deps.smartInsertToTextarea(deps.buildCheckSuggestionMetaBlock(metaContent), 'dice');

    const timestamp = Date.now();
    const detailId = `check_${timestamp}_${Math.random().toString(36).slice(2, 8)}`;
    const checkResultWithTimestamp = {
      success,
      roll: finalRoll,
      total: finalRoll,
      target: targetValue,
      margin: command.criteria === 'gte' ? finalRoll - targetValue : targetValue - finalRoll,
      criticalSuccess: sides === 100 ? finalRoll <= 5 : finalRoll === sides,
      criticalFailure: sides === 100 ? finalRoll >= 96 : finalRoll === 1,
      message: outcomeText,
      diceType: command.diceType,
      rule: command.criteria === 'gte' ? ('dnd' as const) : ('coc' as const),
      outcomeText,
      attrName: command.attributeName,
      formula: command.diceType,
      criteria: command.criteria,
      isAutoTarget: command.targetValue === null,
      timestamp,
      detailId,
      initiatorName: characterName,
      historyType: 'check' as const,
      detailLines: [
        `发起者: ${displayName}`,
        `属性: ${command.attributeName} (值=${targetValue})`,
        `公式: ${command.diceType}`,
        `掷骰: ${finalRoll}`,
        `判定: ${judgeExpr}`,
        `结果: ${outcomeText}`,
      ],
    };
    deps.checkHistory.push(checkResultWithTimestamp);
    if (deps.checkHistory.length > deps.MAX_HISTORY) {
      deps.checkHistory.shift();
    }
    deps.emitEvent('check', checkResultWithTimestamp);
  };
  return executeNormalCheckSuggestion;
}
