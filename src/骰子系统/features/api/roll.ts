// @ts-nocheck
/**
 * features/api/roll.ts
 * Feature-Sliced: 对外 API 的便捷掷骰（roll）方法。
 * 通过 DI 注入表达式求值函数（evaluateFormula），与 monolith 解耦。
 */

export class AcuDiceRoll {
  private readonly deps: {
    evaluateFormula: (expression: string, context: any) => number;
  };

  constructor(deps: {
    evaluateFormula: (expression: string, context: any) => number;
  }) {
    this.deps = deps;
  }

  roll(formula: string): { total: number; formula: string; breakdown: string } {
    if (!formula || typeof formula !== 'string') {
      throw new Error('[AcuDice] roll() 需要一个有效的骰子表达式字符串');
    }
    const hasDice = /\d*d(\d+|F)/i.test(formula);
    const isMath = /^[\d\s+\-*/().]+$/.test(formula.trim());
    if (!hasDice && !isMath) {
      throw new Error(`[AcuDice] 无效的骰子表达式: ${formula}`);
    }
    const total = this.deps.evaluateFormula(formula, {});
    return {
      total,
      formula,
      breakdown: `${formula} = ${total}`,
    };
  }
}