// @ts-nocheck
/**
 * execute-contest-check-suggestion.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { rollComplexDiceExpression } from '../dice/dice-engine';
export function createExecuteContestCheckSuggestion(deps: any) {
  const executeContestCheckSuggestion = (command: Extract<CheckSuggestionParsedCommand, { kind: 'contest' }>) => {
    deps.refreshNameAliasesForCheckSuggestion();
    const leftName = deps.resolveCheckSuggestionCharacterName(command.leftName);
    const rightName = deps.resolveCheckSuggestionCharacterName(command.rightName);
    const leftTarget = deps.getAttributeValue(leftName, command.leftAttribute);
    const rightTarget = deps.getAttributeValue(rightName, command.rightAttribute);
    if (leftTarget === null) {
      throw new Error(`未找到 ${deps.replaceUserPlaceholders(leftName)} 的属性「${command.leftAttribute}」`);
    }
    if (rightTarget === null) {
      throw new Error(`未找到 ${deps.replaceUserPlaceholders(rightName)} 的属性「${command.rightAttribute}」`);
    }

    const leftRoll = rollComplexDiceExpression(command.diceType).total;
    const rightRoll = rollComplexDiceExpression(command.diceType).total;
    if (Number.isNaN(leftRoll) || Number.isNaN(rightRoll)) {
      throw new Error(`无效的骰子公式：${command.diceType}`);
    }

    const sides = deps.getCheckSuggestionDiceSides(command.diceType);
    const leftLevel = deps.getSuccessLevel(leftRoll, leftTarget, sides);
    const rightLevel = deps.getSuccessLevel(rightRoll, rightTarget, sides);
    let winner: 'left' | 'right' | 'tie';

    if (leftLevel.level > rightLevel.level) {
      winner = 'left';
    } else if (leftLevel.level < rightLevel.level) {
      winner = 'right';
    } else if (command.tieRule === 'initiator_win') {
      winner = 'left';
    } else if (command.tieRule === 'tie') {
      winner = 'tie';
    } else {
      winner = 'right';
    }

    const leftDisplayName = deps.replaceUserPlaceholders(leftName);
    const rightDisplayName = deps.replaceUserPlaceholders(rightName);
    const winnerText =
      winner === 'left' ? `${leftDisplayName}胜出` : winner === 'right' ? `${rightDisplayName}胜出` : '双方平局';
    const message = `${winnerText}（${leftLevel.name} vs ${rightLevel.name}）`;
    const metaContent = `元叙事：${leftDisplayName}以【${command.leftAttribute}】对抗${rightDisplayName}的【${command.rightAttribute}】，${command.diceType}=${leftRoll}/${rightRoll}，目标=${leftTarget}/${rightTarget}，结果：${message}。`;
    deps.smartInsertToTextarea(deps.buildCheckSuggestionMetaBlock(metaContent), 'dice');

    const contestResult: AcuDice.ContestResult = {
      left: {
        name: leftName,
        attribute: command.leftAttribute,
        roll: leftRoll,
        target: leftTarget,
        successLevel: leftLevel.level,
      },
      right: {
        name: rightName,
        attribute: command.rightAttribute,
        roll: rightRoll,
        target: rightTarget,
        successLevel: rightLevel.level,
      },
      winner,
      message,
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
        `公式: ${command.diceType}`,
        `掷骰: ${leftRoll} vs ${rightRoll}`,
        `目标: ${leftTarget} vs ${rightTarget}`,
        `成功等级: ${leftLevel.name} vs ${rightLevel.name}`,
        `平手规则: ${command.tieRule}`,
        `结果: ${message}`,
      ],
    };
    deps.contestHistory.push(contestResultWithTimestamp);
    if (deps.contestHistory.length > deps.MAX_HISTORY) {
      deps.contestHistory.shift();
    }
    deps.emitEvent('contest', contestResultWithTimestamp);
  };
  return executeContestCheckSuggestion;
}
