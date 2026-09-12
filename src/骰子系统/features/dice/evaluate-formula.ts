// @ts-nocheck
/**
 * evaluate-formula.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { rollDiceExpression } from './dice-engine';
export function createEvaluateFormula(deps: any) {
  const evaluateFormula = (formula, context = {}) => {
    if (!formula) return 0;

    let expr = String(formula).trim();

    // 1. 替换变量为数值（按长度降序替换，避免部分匹配）
    const varNames = Object.keys(context).sort((a, b) => b.length - a.length);
    for (const name of varNames) {
      const value = context[name];
      if (typeof value === 'number' && !isNaN(value)) {
        // 用括号包裹避免运算优先级问题
        expr = expr.split(name).join(`(${value})`);
      }
    }

    // 2. 替换骰子表达式为数值
    expr = expr.replace(
      /\d*d(?:\d+|F)(?:[bp]\d+)?(?:r[o]?(?:[><!=]+)?\d*)?(?:!!?(?:[><!=]+\d+)?)?(?:kh\d+|kl\d+|dh\d+|dl\d+)?(?:(?:[><!=]+)\d+)?/gi,
      match => {
        const result = rollDiceExpression(match);
        return Number.isNaN(result.total) ? '0' : String(result.total);
      },
    );

    // 3. 安全性检查：只允许数字和基本运算符
    if (!/^[\d\s+\-*/().]+$/.test(expr)) {
      console.warn('[DICE]evaluateFormula 公式包含非法字符:', formula, '→', expr);
      return 0;
    }

    // 4. 计算数学表达式
    try {
      // eslint-disable-next-line no-new-func
      const result = new Function(`return (${expr})`)();
      return Math.round(result); // 四舍五入为整数
    } catch (e) {
      console.error('[DICE]evaluateFormula 公式计算失败:', formula, '→', expr, e);
      return 0;
    }
  };
  return evaluateFormula;
}
