// @ts-nocheck
/**
 * shared/effect-math.ts
 * Feature-Sliced: batch extract (FSD batch A1).
 */

import { rollComplexDiceExpression } from '../features/dice/dice-engine';

export function computeEffectVariables(results: EffectResult[]): Record<string, string | number | boolean> {
    if (!results || results.length === 0) {
      return {
        effectTarget: '',
        effectOperation: '',
        effectDelta: 0,
        effectDeltaFormula: '',
        effectOldValue: 0,
        effectNewValue: 0,
        effectSummary: '',
        effectText: '',
        hasEffect: false,
        effectCount: 0,
        effectResults: '[]',
      };
    }

    // 使用最后一个成功的结果，若全部失败则使用最后一个
    const successResults = results.filter(r => r.success);
    const lastSuccess =
      successResults.length > 0 ? successResults[successResults.length - 1] : results[results.length - 1];

    const delta = lastSuccess.newValue - lastSuccess.oldValue;
    const operation = delta > 0 ? '增加' : delta < 0 ? '减少' : '设置为';

    // 生成所有成功效果的摘要
    const summaries = successResults.map(r => {
      const d = r.newValue - r.oldValue;
      const op = d > 0 ? '+' : '';
      return `${r.effectId}: ${op}${d} (${r.oldValue}→${r.newValue})`;
    });

    return {
      effectTarget: lastSuccess.effectId,
      effectOperation: operation,
      effectDelta: Math.abs(delta),
      effectDeltaFormula: `${Math.abs(delta)}`,
      effectOldValue: lastSuccess.oldValue,
      effectNewValue: lastSuccess.newValue,
      effectSummary:
        successResults.length > 0
          ? `${operation} ${Math.abs(delta)} (${lastSuccess.oldValue} → ${lastSuccess.newValue})`
          : '',
      effectText: summaries.join('; '),
      hasEffect: successResults.length > 0,
      effectCount: successResults.length,
      effectResults: JSON.stringify(results),
    };
  }

export function computePendingEffectVariables(effects: Effect[] | undefined): Record<string, string | number | boolean> {
    if (!effects || effects.length === 0) {
      return {
        effectTarget: '',
        effectOperation: '',
        effectDelta: 0,
        effectDeltaFormula: '',
        effectOldValue: 0,
        effectNewValue: 0,
        effectSummary: '',
        effectText: '',
        hasEffect: false,
        effectCount: 0,
        effectResults: '[]',
      };
    }

    // 使用第一个效果作为主要显示
    const firstEffect = effects[0];
    const operationMap: Record<string, string> = {
      add: '增加',
      subtract: '减少',
      set: '设置为',
    };
    const operation = operationMap[firstEffect.operation] || firstEffect.operation;

    // 生成所有效果的预期摘要
    const summaries = effects.map(e => {
      const op = operationMap[e.operation] || e.operation;
      return `${e.target}: ${op} ${e.value}`;
    });

    return {
      effectTarget: firstEffect.target,
      effectOperation: operation,
      effectDelta: 0, // 未执行，无法知道实际变化量
      effectDeltaFormula: firstEffect.value,
      effectOldValue: 0, // 未执行，无法知道原值
      effectNewValue: 0, // 未执行，无法知道新值
      effectSummary: `${firstEffect.target} ${operation} ${firstEffect.value}`,
      effectText: summaries.join('; '),
      hasEffect: true,
      effectCount: effects.length,
      effectResults: JSON.stringify(effects.map(e => ({ effectId: e.id, pending: true }))),
    };
  }

export function parseEffectValueInput(
    rawValue: unknown,
    traceLabel: string,
  ): {
    formulaText: string;
    finalValue: number;
    rolledValue: number;
    valid: boolean;
  } {
    const formulaText = String(rawValue ?? '').trim() || '0';
    const rollResult = rollComplexDiceExpression(formulaText);
    if (Number.isNaN(rollResult.total)) {
      console.warn(`[DICE] ${traceLabel} 效果值解析失败: "${formulaText}"，按 0 处理`);
      return {
        formulaText,
        finalValue: 0,
        rolledValue: 0,
        valid: false,
      };
    }

    const value = Math.round(rollResult.total);
    return {
      formulaText,
      finalValue: value,
      rolledValue: value,
      valid: true,
    };
  }

export function buildEffectMetaLines(
    results: EffectResult[],
    options?: {
      branchReasonText?: string;
    },
  ): string[] {
    if (!results || results.length === 0) return [];
    const settledHeader = '【已填表】以下数值效果已同步填表，无需重复填表。';
    const lines = results
      .filter(item => item.success)
      .map(item => {
        if (item.outputMessage) {
          return item.outputMessage;
        }

        const target = item.target || '属性';
        const delta = item.newValue - item.oldValue;
        const sign = delta > 0 ? '+' : '';
        const primaryBranch = item.branchLabel?.startsWith('L1/') ? item.branchLabel.slice(3) : '';
        const formulaDetail =
          item.formulaText && item.rolledValue !== undefined
            ? `，${primaryBranch ? `按${primaryBranch}分支` : '按当前分支'}算式${item.formulaText}得到${item.rolledValue}`
            : '';

        const reasonPrefix = primaryBranch ? `命中${primaryBranch}分支后，` : '';
        return `${reasonPrefix}${target}从${item.oldValue}变为${item.newValue}（变化${sign}${delta}${formulaDetail}）`;
      });

    // 避免与主检定叙事重复：优先输出效果行，仅在没有效果行时回退到分支原因
    if (lines.length > 0) return [settledHeader, ...lines];
    if (options?.branchReasonText) return [settledHeader, options.branchReasonText];
    return [];
  }

export function buildEffectTraceLines(results: EffectResult[]): string[] {
    if (!results || results.length === 0) return [];
    return results.map(item => {
      const prefix = item.branchLabel ? `[${item.branchLabel}] ` : item.level ? `[L${item.level}] ` : '';
      const target = item.target || '-';
      // 失败条目优先（事务回滚时所有结果被标记 success:false，outputMessage 条目也不应显示为成功）
      if (!item.success && item.error) {
        return `${prefix}✗ ${target} 变更失败: ${item.error}`;
      }
      // 信息输出型条目（来自 secondaryEffect.outputText）
      if (item.outputMessage) {
        return `${prefix}${item.outputMessage}`;
      }
      const delta = item.newValue - item.oldValue;
      const sign = delta > 0 ? '+' : '';
      const icon = item.success ? '✓' : '✗';
      const formulaInfo = item.formulaText
        ? ` ｜算式:${item.formulaText}${item.rolledValue !== undefined ? ` ｜掷值:${item.rolledValue}` : ''}`
        : '';
      return `${prefix}${icon} ${target} ${item.oldValue} → ${item.newValue} (${sign}${delta})${formulaInfo}`;
    });
  }
