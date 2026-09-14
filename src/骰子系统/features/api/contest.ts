// @ts-nocheck
/**
 * features/api/contest.ts
 * Feature-Sliced: 对外 API 的对抗检定（contest）方法。
 * 通过 DI 注入别名/属性/骰子配置/公式/引擎/成功等级/历史/事件，与 monolith 解耦。
 */

export class AcuDiceContest {
  private readonly deps: {
    getRawData: () => any;
    processJsonData: (raw: any) => any;
    rebuildAliasRegistry: (tables: any) => void;
    resolveCanonicalCharacterName: (name: string) => string;
    getAttributeValueInternal: (name: string, attribute: string) => number | null;
    getDiceConfig: () => any;
    normalizeDiceFormula: (formula: string) => string;
    rollComplexDiceExpression: (expr: string) => { total: number };
    getSuccessLevel: (roll: number, target: number, sides: number) => { level: number; name: string };
    appendContestHistory: (entry: any) => void;
    emitEvent: (event: string, payload: any) => void;
  };

  constructor(deps: {
    getRawData: () => any;
    processJsonData: (raw: any) => any;
    rebuildAliasRegistry: (tables: any) => void;
    resolveCanonicalCharacterName: (name: string) => string;
    getAttributeValueInternal: (name: string, attribute: string) => number | null;
    getDiceConfig: () => any;
    normalizeDiceFormula: (formula: string) => string;
    rollComplexDiceExpression: (expr: string) => { total: number };
    getSuccessLevel: (roll: number, target: number, sides: number) => { level: number; name: string };
    appendContestHistory: (entry: any) => void;
    emitEvent: (event: string, payload: any) => void;
  }) {
    this.deps = deps;
  }

  async contest(options: {
    left?: { name: string; attribute: string; targetValue?: number };
    right?: { name: string; attribute: string; targetValue?: number };
    /** @deprecated 使用 left 代替 */
    attacker?: { name: string; attribute: string; targetValue?: number };
    /** @deprecated 使用 right 代替 */
    defender?: { name: string; attribute: string; targetValue?: number };
    rule?: 'initiator_win' | 'initiator_lose' | 'tie';
    diceType?: string;
  }): Promise<{
    left: { name: string; attribute: string; roll: number; target: number; successLevel: number };
    right: { name: string; attribute: string; roll: number; target: number; successLevel: number };
    winner: 'left' | 'right' | 'tie';
    message: string;
  }> {
    // 兼容 attacker/defender 别名
    const left = options?.left || options?.attacker;
    const right = options?.right || options?.defender;

    if (!left?.name || !left?.attribute) {
      throw new Error('[AcuDice] contest() 需要 left.name 和 left.attribute 参数');
    }
    if (!right?.name || !right?.attribute) {
      throw new Error('[AcuDice] contest() 需要 right.name 和 right.attribute 参数');
    }

    try {
      const rawDataForAlias = this.deps.getRawData();
      if (rawDataForAlias) {
        this.deps.rebuildAliasRegistry(this.deps.processJsonData(rawDataForAlias || {}));
      }
    } catch (error) {
      console.warn('[AcuDice] contest() 别名映射刷新失败', error);
    }

    const leftName = this.deps.resolveCanonicalCharacterName(left.name);
    const rightName = this.deps.resolveCanonicalCharacterName(right.name);

    // 获取双方属性值（优先使用 targetValue，否则从角色数据查找）
    let leftTarget = left.targetValue ?? null;
    if (leftTarget === null) {
      leftTarget = this.deps.getAttributeValueInternal(leftName, left.attribute);
      if (leftTarget === null) {
        throw new Error(`[AcuDice] 未找到角色 "${leftName}" 的属性 "${left.attribute}"`);
      }
    }

    let rightTarget = right.targetValue ?? null;
    if (rightTarget === null) {
      rightTarget = this.deps.getAttributeValueInternal(rightName, right.attribute);
      if (rightTarget === null) {
        throw new Error(`[AcuDice] 未找到角色 "${rightName}" 的属性 "${right.attribute}"`);
      }
    }

    // 获取骰子配置
    const diceCfg = this.deps.getDiceConfig();
    const formula = this.deps.normalizeDiceFormula(options.diceType || diceCfg.lastDiceType || '1d100');

    // 投骰
    const leftResult = this.deps.rollComplexDiceExpression(formula).total;
    const rightResult = this.deps.rollComplexDiceExpression(formula).total;
    if (Number.isNaN(leftResult) || Number.isNaN(rightResult)) {
      throw new Error(`[AcuDice] 无效的骰子公式: ${formula}`);
    }

    // 解析骰子类型获取 sides
    const sidesMatch = formula.match(/\d+d(\d+)/i);
    const sides = sidesMatch ? parseInt(sidesMatch[1], 10) : 100;

    // 计算成功等级
    const leftSuccessLevel = this.deps.getSuccessLevel(leftResult, leftTarget, sides);
    const rightSuccessLevel = this.deps.getSuccessLevel(rightResult, rightTarget, sides);

    // 判定胜负
    let winner: 'left' | 'right' | 'tie';
    let message: string;

    if (leftSuccessLevel.level > rightSuccessLevel.level) {
      winner = 'left';
      message = `${leftName} 胜利！(${leftSuccessLevel.name} 胜过 ${rightSuccessLevel.name})`;
    } else if (leftSuccessLevel.level < rightSuccessLevel.level) {
      winner = 'right';
      message = `${rightName} 胜利！(${rightSuccessLevel.name} 胜过 ${leftSuccessLevel.name})`;
    } else {
      // 平手情况
      const tieRule = options.rule || diceCfg.contestTieRule || 'initiator_lose';
      message = `双方平手！(均为 ${leftSuccessLevel.name})`;

      if (tieRule === 'initiator_win') {
        winner = 'left';
        message += ` - ${leftName} 判胜`;
      } else if (tieRule === 'tie') {
        winner = 'tie';
      } else {
        // initiator_lose
        winner = 'right';
        message += ` - ${leftName} 判负`;
      }
    }

    const result = {
      left: {
        name: leftName,
        attribute: left.attribute,
        roll: leftResult,
        target: leftTarget,
        successLevel: leftSuccessLevel.level,
      },
      right: {
        name: rightName,
        attribute: right.attribute,
        roll: rightResult,
        target: rightTarget,
        successLevel: rightSuccessLevel.level,
      },
      winner,
      message,
    };

    // 触发事件
    this.deps.emitEvent('contest', result);

    // 记录到历史
    this.deps.appendContestHistory({
      ...result,
      timestamp: Date.now(),
      detailId: `contest_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      detailLines: [
        `发起方: ${result.left.name} / 对抗方: ${result.right.name}`,
        `属性: ${result.left.attribute} vs ${result.right.attribute}`,
        `掷骰: ${result.left.roll} vs ${result.right.roll}`,
        `目标: ${result.left.target} vs ${result.right.target}`,
        `胜者: ${result.winner === 'left' ? result.left.name : result.winner === 'right' ? result.right.name : '平局'}`,
        `说明: ${result.message}`,
      ],
    });

    return result;
  }
}