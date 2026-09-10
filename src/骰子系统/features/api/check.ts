// @ts-nocheck
/**
 * features/api/check.ts
 * Feature-Sliced: 对外 API 的属性/技能检定（check）方法。
 * 通过 DI 注入骰子配置/属性读取/表达式引擎/历史追加/事件派发，与 monolith 解耦。
 */

export class AcuDiceCheck {
  private readonly deps: {
    getDiceConfig: () => any;
    getAttributeValueInternal: (name: string, attribute: string) => number | null;
    rollComplexDiceExpression: (expr: string, context?: any) => { total: number };
    appendCheckHistory: (entry: any) => void;
    emitEvent: (event: string, payload: any) => void;
  };

  constructor(deps: {
    getDiceConfig: () => any;
    getAttributeValueInternal: (name: string, attribute: string) => number | null;
    rollComplexDiceExpression: (expr: string, context?: any) => { total: number };
    appendCheckHistory: (entry: any) => void;
    emitEvent: (event: string, payload: any) => void;
  }) {
    this.deps = deps;
  }

  async check(
    options: {
      attribute?: string;
      skill?: string;
      targetValue?: number;
      diceType?: string;
      successCriteria?: 'lte' | 'gte';
      modifier?: number;
    } = {},
  ): Promise<{
    success: boolean;
    roll: number;
    target: number;
    margin: number;
    criticalSuccess: boolean;
    criticalFailure: boolean;
    message: string;
    diceType: string;
    rule: 'coc' | 'dnd';
  }> {
    const diceCfg = this.deps.getDiceConfig();
    const diceType = options.diceType || diceCfg.lastDiceType || '1d100';
    const successCriteria = options.successCriteria || (diceType === '1d20' ? 'gte' : 'lte');
    const isDND = successCriteria === 'gte';
    const modifier = options.modifier || 0;

    // 获取目标值
    let targetValue = options.targetValue;

    // 如果指定了属性名但没有目标值，尝试从角色数据获取
    if (targetValue === undefined && (options.attribute || options.skill)) {
      const attrName = options.attribute || options.skill || '';
      const resolvedValue = this.deps.getAttributeValueInternal('<user>', attrName);
      if (resolvedValue !== null) targetValue = resolvedValue;

      if (targetValue === undefined) {
        throw new Error(`[AcuDice] 未找到属性或技能: ${attrName}`);
      }
    }

    if (targetValue === undefined) {
      throw new Error('[AcuDice] check() 需要 targetValue 或有效的 attribute/skill 名称');
    }

    // 投骰
    const rollResult = this.deps.rollComplexDiceExpression(diceType);
    if (Number.isNaN(rollResult.total)) {
      throw new Error(`[AcuDice] 无效的骰子表达式: ${diceType}`);
    }

    const finalRoll = rollResult.total + modifier;
    const target = targetValue;

    // 判定结果
    let success = false;
    let criticalSuccess = false;
    let criticalFailure = false;
    let message = '';

    if (isDND) {
      // DND 规则: roll >= target 成功
      success = finalRoll >= target;
      criticalSuccess = rollResult.total === diceCfg.dndCritSuccess;
      criticalFailure = rollResult.total === diceCfg.dndCritFail;

      if (criticalSuccess) {
        success = true;
        message = `大成功！掷出 ${rollResult.total}${modifier ? ` + ${modifier}` : ''} = ${finalRoll}，DC ${target}`;
      } else if (criticalFailure) {
        success = false;
        message = `大失败！掷出 ${rollResult.total}${modifier ? ` + ${modifier}` : ''} = ${finalRoll}，DC ${target}`;
      } else if (success) {
        message = `成功！掷出 ${finalRoll} >= DC ${target}`;
      } else {
        message = `失败！掷出 ${finalRoll} < DC ${target}`;
      }
    } else {
      // COC 规则: roll <= target 成功
      success = finalRoll <= target;
      criticalSuccess = finalRoll <= diceCfg.critSuccessMax;
      criticalFailure = finalRoll >= diceCfg.critFailMin;

      if (criticalSuccess) {
        success = true;
        message = `大成功！掷出 ${finalRoll}，目标 ${target}`;
      } else if (criticalFailure) {
        success = false;
        message = `大失败！掷出 ${finalRoll}，目标 ${target}`;
      } else if (success) {
        const hardSuccess = finalRoll <= Math.floor(target / diceCfg.hardSuccessDiv);
        const extremeSuccess = finalRoll <= Math.floor(target / diceCfg.difficultSuccessDiv);
        if (extremeSuccess) {
          message = `极难成功！掷出 ${finalRoll} <= ${Math.floor(target / diceCfg.difficultSuccessDiv)}`;
        } else if (hardSuccess) {
          message = `困难成功！掷出 ${finalRoll} <= ${Math.floor(target / diceCfg.hardSuccessDiv)}`;
        } else {
          message = `成功！掷出 ${finalRoll} <= ${target}`;
        }
      } else {
        message = `失败！掷出 ${finalRoll} > ${target}`;
      }
    }

    const checkResult: any = {
      success,
      total: finalRoll,
      target,
      outcomeText: message,
      attrName: options.attribute || options.skill || '',
      formula: diceType,
      criteria: isDND ? 'gte' : 'lte',
      isAutoTarget: options.targetValue === undefined,
    };

    // 写入历史记录
    const detailId = `check_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const attrLabel = options.attribute || options.skill || '未指定';
    const checkResultWithTimestamp = {
      ...checkResult,
      timestamp: Date.now(),
      detailId,
      initiatorName: 'API',
      historyType: 'check' as const,
      detailLines: [
        `发起者: API`,
        `属性: ${attrLabel} (值=${target})`,
        `公式: ${diceType}`,
        `掷骰: ${finalRoll}`,
        `目标: ${target}`,
        ...(modifier ? [`修正: ${modifier >= 0 ? '+' + modifier : modifier}`] : []),
        `结果: ${message}`,
      ],
    };
    this.deps.appendCheckHistory(checkResultWithTimestamp);

    // 触发事件
    this.deps.emitEvent('check', checkResultWithTimestamp);

    return {
      success,
      roll: finalRoll,
      target,
      margin: isDND ? finalRoll - target : target - finalRoll,
      criticalSuccess,
      criticalFailure,
      message,
      diceType,
      rule: isDND ? 'dnd' : 'coc',
    };
  }
}