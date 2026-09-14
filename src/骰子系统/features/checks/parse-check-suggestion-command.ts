// @ts-nocheck
/**
 * parse-check-suggestion-command.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createParseCheckSuggestionCommand(deps: any) {
  const parseCheckSuggestionCommand = (rawCommand: string): CheckSuggestionParsedCommand => {
    const command = deps.normalizeCheckSuggestionCommandInput(rawCommand);
    if (!command) return { kind: 'invalid', reason: '骰子命令为空' };
    if (/^(必成|必定成功|自动成功)(?:\s|$)/.test(command)) return { kind: 'fixed', success: true };
    if (/^(必败|必定失败|自动失败)(?:\s|$)/.test(command)) return { kind: 'fixed', success: false };
    if (/^(无|无需检定|不检定|无检定)(?:\s|$)/.test(command)) return { kind: 'none' };

    if (command.startsWith('检定 ')) {
      const withoutPrefix = command.replace(/^检定\s+/, '').trim();
      const paramsExtracted = deps.extractCheckSuggestionParams(withoutPrefix);
      const targetExtracted = deps.extractCheckSuggestionTarget(paramsExtracted.rest);
      const diceExtracted = deps.extractCheckSuggestionDiceFormula(targetExtracted.rest);
      const side = deps.parseCheckSuggestionSide(diceExtracted.rest);
      if (!side) return { kind: 'invalid', reason: '普通检定命令格式应为：检定 <角色> <属性> [key=value ...]' };
      return {
        kind: 'check',
        characterName: side.name,
        attributeName: side.attribute,
        diceType: diceExtracted.diceType,
        hasExplicitDice: diceExtracted.hasExplicitDice,
        targetValue: targetExtracted.targetValue,
        criteria: targetExtracted.criteria,
        rawParams: paramsExtracted.rawParams,
      };
    }

    if (command.startsWith('对抗 ')) {
      const withoutPrefix = command.replace(/^对抗\s+/, '').trim();
      const tieExtracted = deps.extractCheckSuggestionTieRule(withoutPrefix);
      const diceExtracted = deps.extractCheckSuggestionDiceFormula(tieExtracted.rest);
      const paramsExtracted = deps.extractCheckSuggestionParams(diceExtracted.rest);
      const sides = paramsExtracted.rest.split(/\s+vs\s+/i);
      if (sides.length !== 2) {
        return { kind: 'invalid', reason: '对抗检定命令格式应为：对抗 <角色> <属性> vs <角色> <属性> [key=value ...]' };
      }
      const left = deps.parseCheckSuggestionSide(sides[0]);
      const right = deps.parseCheckSuggestionSide(sides[1]);
      if (!left || !right) {
        return { kind: 'invalid', reason: '对抗检定需要双方角色和属性' };
      }
      return {
        kind: 'contest',
        leftName: left.name,
        leftAttribute: left.attribute,
        rightName: right.name,
        rightAttribute: right.attribute,
        diceType: diceExtracted.diceType,
        hasExplicitDice: diceExtracted.hasExplicitDice,
        tieRule: tieExtracted.tieRule,
        hasExplicitTieRule: tieExtracted.hasExplicitTieRule,
        rawParams: paramsExtracted.rawParams,
      };
    }

    return { kind: 'invalid', reason: `无法识别的骰子命令：${command}` };
  };
  return parseCheckSuggestionCommand;
}
