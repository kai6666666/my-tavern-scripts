// @ts-nocheck
// 来源：src/features/dice/index.ts 章节 idx=28「公式解析器系统（支持骰子表达式和变量引用）」
// 原行范围：16886-17855（含 banner 16877-17855）；拆分批次 3；外部 closure 依赖：0
// 接线说明：RollResult 类型来自同目录 types.ts，import type 引入（esbuild 剥离，无运行时依赖）；
//   OutcomeLevel 类型定义于 index.ts IIFE 内（章节21），此处仅作类型标注，@ts-nocheck 下无运行时影响。

import type { RollResult } from './types';
  // ========================================
  // 公式解析器系统（支持骰子表达式和变量引用）
  // ========================================

  /**
   * 投单个骰子表达式
   * 支持: 3d6, 4d6kh3, 4d6dl1, 4d6dh1
   * @returns 标准化 RollResult，解析失败 total 为 NaN
   */
  const rollDiceExpression = (expr: string): RollResult => {
    const formula = String(expr);
    const rollDice = (sides: number) => Math.floor(Math.random() * sides) + 1;

    // 匹配 XdY 或 XdF 语法，支持重掷、爆炸、保留/舍弃和成功计数
    const match = formula.match(
      /^(\d*)d(\d+|F)([bp]\d+)?(r[o]?(?:[><!=]+)?\d*)?(!!?(?:[><!=]+\d+)?)?(kh\d+|kl\d+|dh\d+|dl\d+)?((?:[><!=]+)\d+)?$/i,
    );
    if (!match) {
      return {
        total: Number.NaN,
        rawDice: [],
        keptDice: [],
        formula,
        breakdown: formula ? `${formula}=NaN` : 'NaN',
        tags: [],
      };
    }

    const [, countStr, sidesOrF, cocPart, rerollPart, explodePart, keepDrop, successPart] = match;
    const count = countStr ? parseInt(countStr, 10) : 1;
    const isFate = sidesOrF.toUpperCase() === 'F';
    const sides = isFate ? 0 : parseInt(sidesOrF, 10);

    let rolls: number[] = [];
    if (isFate) {
      // FATE 骰子: 取值 [-1, 0, 1]
      rolls = Array.from({ length: count }, () => Math.floor(Math.random() * 3) - 1);
    } else {
      // 普通骰子

      // 解析重掷修饰符
      let rerollType = null;
      let rerollCompare = '=';
      let rerollValue = 1;

      if (rerollPart) {
        const m = rerollPart.match(/^(r[o]?)([><!=]+)?(\d+)?$/i);
        if (m) {
          rerollType = m[1].toLowerCase();
          if (m[2]) rerollCompare = m[2];
          if (m[3]) rerollValue = parseInt(m[3], 10);
          else if (!m[2]) rerollValue = 1; // 仅 r 或 ro 默认为 1
        }
      }

      const checkReroll = (val: number) => {
        if (!rerollType) return false;
        switch (rerollCompare) {
          case '>=':
            return val >= rerollValue;
          case '<=':
            return val <= rerollValue;
          case '=':
          case '==':
            return val === rerollValue;
          case '>':
            return val > rerollValue;
          case '<':
            return val < rerollValue;
          case '!=':
          case '<>':
            return val !== rerollValue;
          default:
            return val === rerollValue;
        }
      };

      // 解析爆炸修饰符
      let explodeType = null;
      let explodeCompare = '=';
      let explodeValue = sides;

      if (explodePart) {
        const m = explodePart.match(/^(!!?)([><=!]+)?(\d+)?$/);
        if (m) {
          explodeType = m[1];
          if (m[2]) explodeCompare = m[2];
          if (m[3]) explodeValue = parseInt(m[3], 10);
        }
      }

      const checkExplode = (val: number) => {
        if (!explodeType) return false;
        switch (explodeCompare) {
          case '>=':
            return val >= explodeValue;
          case '<=':
            return val <= explodeValue;
          case '=':
          case '==':
            return val === explodeValue;
          case '>':
            return val > explodeValue;
          case '<':
            return val < explodeValue;
          case '!=':
          case '<>':
            return val !== explodeValue;
          default:
            return val === sides;
        }
      };

      // 解析 CoC 奖励/惩罚骰 (仅对 d100 生效)
      let cocType = null;
      let cocCount = 0;
      if (cocPart && sides === 100) {
        const m = cocPart.match(/^([bp])(\d+)$/i);
        if (m) {
          cocType = m[1].toLowerCase();
          cocCount = parseInt(m[2], 10);
        }
      }

      for (let i = 0; i < count; i++) {
        let val = rollDice(sides);

        // CoC 奖励/惩罚骰逻辑
        if (cocType) {
          const tens = Math.floor((val === 100 ? 0 : val) / 10);
          const units = val % 10;
          const additionalTens = Array.from({ length: cocCount }, () => Math.floor(Math.random() * 10));
          const allTens = [tens, ...additionalTens];
          let finalTens;
          if (cocType === 'b') {
            finalTens = Math.min(...allTens);
          } else {
            finalTens = Math.max(...allTens);
          }
          const result = finalTens * 10 + units;
          val = result === 0 ? 100 : result;
        }

        // 重掷逻辑 (在爆炸之前执行)
        if (rerollType) {
          let rerollCount = 0;
          while (checkReroll(val) && rerollCount < 100) {
            rerollCount++;
            val = rollDice(sides);
            if (rerollType === 'ro') break; // ro 只重掷一次
          }
        }

        if (explodeType) {
          let currentVal = val;
          let nextToCheck = val;
          let explodeCount = 0;
          while (checkExplode(nextToCheck) && explodeCount < 100) {
            explodeCount++;
            nextToCheck = rollDice(sides);
            if (explodeType === '!') {
              rolls.push(currentVal);
              currentVal = nextToCheck;
            } else {
              currentVal += nextToCheck;
            }
          }
          rolls.push(currentVal);
        } else {
          rolls.push(val);
        }
      }
    }

    const rawDice = [...rolls];
    let keptDice = [...rolls];

    // 处理 keep/drop
    if (keepDrop) {
      const kd = keepDrop.toLowerCase();
      const n = parseInt(kd.slice(2), 10);
      const sorted = [...keptDice].sort((a, b) => b - a); // 降序排列

      if (kd.startsWith('kh'))
        keptDice = sorted.slice(0, n); // 保留最高n个
      else if (kd.startsWith('kl'))
        keptDice = sorted.slice(-n); // 保留最低n个
      else if (kd.startsWith('dh'))
        keptDice = sorted.slice(n); // 去掉最高n个
      else if (kd.startsWith('dl')) keptDice = sorted.slice(0, -n); // 去掉最低n个
    }

    let total = keptDice.reduce((a, b) => a + b, 0);

    // 处理成功计数 (骰池)
    if (successPart) {
      const sm = successPart.match(/^([><!=]+)(\d+)$/);
      if (sm) {
        const op = sm[1];
        const val = parseInt(sm[2], 10);
        const isSuccess = (roll: number) => {
          switch (op) {
            case '>=':
              return roll >= val;
            case '<=':
              return roll <= val;
            case '=':
            case '==':
              return roll === val;
            case '>':
              return roll > val;
            case '<':
              return roll < val;
            case '!=':
            case '<>':
              return roll !== val;
            default:
              return false;
          }
        };
        total = keptDice.filter(isSuccess).length;
      }
    }

    const tags: string[] = [];
    if (!isFate && sides === 20) {
      const diceToCheck = keptDice.length > 0 ? keptDice : rawDice;
      if (diceToCheck.some(roll => roll === 20)) tags.push('nat20');
      if (diceToCheck.some(roll => roll === 1)) tags.push('nat1');
    }

    const totalText = Number.isNaN(total) ? 'NaN' : String(total);
    const diceList = rawDice.length > 0 ? `[${rawDice.join(',')}]` : '[]';
    const showList = rawDice.length !== 1 || Boolean(keepDrop) || Boolean(successPart);
    const breakdown = showList ? `${formula}=${diceList}→${totalText}` : `${formula}=${totalText}`;

    return {
      total,
      rawDice,
      keptDice,
      formula,
      breakdown,
      tags,
    };
  };

  // 计算骰子表达式的期望值（用于默认目标值）
  const calculateDiceExpectedValue = (diceExpr: string): number => {
    const formula = String(diceExpr).replace(/\s+/g, '');
    if (!formula) return Number.NaN;

    const parts = formula.match(/[+-]?[^+-]+/g);
    if (!parts) return Number.NaN;

    let total = 0;
    for (const part of parts) {
      if (!part) continue;
      const sign = part.startsWith('-') ? -1 : 1;
      const body = part.replace(/^[+-]/, '');
      if (!body) continue;

      const diceMatch = body.match(
        /^(\d*)d(\d+|F)([bp]\d+)?(r[o]?(?:[><!=]+)?\d*)?(!!?(?:[><!=]+\d+)?)?(kh\d+|kl\d+|dh\d+|dl\d+)?((?:[><!=]+)\d+)?$/i,
      );

      if (diceMatch) {
        const [, countStr, sidesOrF, , , , keepDrop] = diceMatch;
        const count = countStr ? parseInt(countStr, 10) : 1;
        const isFate = sidesOrF.toUpperCase() === 'F';
        const sides = isFate ? 0 : parseInt(sidesOrF, 10);
        const expectedPerDie = isFate ? 0 : (1 + sides) / 2;

        let keptCount = count;
        if (keepDrop) {
          const keepDropType = keepDrop.slice(0, 2);
          const keepDropValue = parseInt(keepDrop.slice(2), 10);
          if (!Number.isNaN(keepDropValue)) {
            if (keepDropType === 'kh' || keepDropType === 'kl') {
              keptCount = Math.min(count, keepDropValue);
            } else if (keepDropType === 'dh' || keepDropType === 'dl') {
              keptCount = Math.max(0, count - keepDropValue);
            }
          }
        }

        total += sign * keptCount * expectedPerDie;
        continue;
      }

      const numericValue = Number(body);
      if (Number.isNaN(numericValue)) {
        return Number.NaN;
      }
      total += sign * numericValue;
    }

    return total;
  };

  // 复合骰子表达式掷骰（支持 2d6+33 等算术修饰符）
  const rollComplexDiceExpression = (expr: string): RollResult => {
    const formula = String(expr).replace(/\s+/g, '');
    if (!formula) {
      return { total: Number.NaN, rawDice: [], keptDice: [], formula: '', breakdown: 'NaN', tags: [] };
    }

    // 先尝试简单表达式
    const simpleResult = rollDiceExpression(formula);
    if (!Number.isNaN(simpleResult.total)) {
      return simpleResult;
    }

    // 解析复合表达式（如 2d6+33, d20-5）
    const parts = formula.match(/[+-]?[^+-]+/g);
    if (!parts) {
      return { total: Number.NaN, rawDice: [], keptDice: [], formula, breakdown: `${formula}=NaN`, tags: [] };
    }

    let total = 0;
    const allRawDice: number[] = [];
    const allKeptDice: number[] = [];
    const breakdownParts: string[] = [];
    const allTags: string[] = [];

    for (const part of parts) {
      if (!part) continue;
      const sign = part.startsWith('-') ? -1 : 1;
      const body = part.replace(/^[+-]/, '');
      if (!body) continue;

      // 尝试作为骰子表达式解析
      const diceResult = rollDiceExpression(body);
      if (!Number.isNaN(diceResult.total)) {
        total += sign * diceResult.total;
        allRawDice.push(...diceResult.rawDice);
        allKeptDice.push(...diceResult.keptDice);
        breakdownParts.push(
          sign === -1
            ? `-${diceResult.breakdown}`
            : breakdownParts.length > 0
              ? `+${diceResult.breakdown}`
              : diceResult.breakdown,
        );
        allTags.push(...diceResult.tags);
        continue;
      }

      // 尝试作为数字解析
      const numericValue = Number(body);
      if (!Number.isNaN(numericValue)) {
        total += sign * numericValue;
        const signedValue = sign * numericValue;
        breakdownParts.push(signedValue >= 0 && breakdownParts.length > 0 ? `+${signedValue}` : String(signedValue));
        continue;
      }

      // 无法解析
      return { total: Number.NaN, rawDice: [], keptDice: [], formula, breakdown: `${formula}=NaN`, tags: [] };
    }

    return {
      total,
      rawDice: allRawDice,
      keptDice: allKeptDice,
      formula,
      breakdown: `${breakdownParts.join('')}=${total}`,
      tags: allTags,
    };
  };

  /**
   * 解析并计算公式（支持变量引用）
   * @param formula 公式字符串，如 "力量/2+1d10" 或 "3d6*5"
   * @param context 变量上下文，如 { 力量: 50, 敏捷: 40 }
   * @returns 计算结果（整数）
   */
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

  /**
   * 评估条件表达式（支持比较运算和逻辑运算）
   * @param {string} formula 表达式字符串
   * @param {Record<string, number>} context 变量上下文
   * @returns {{success: boolean, value?: number | boolean, error?: string}}
   */
  const evaluateCondition = (formula, context = {}) => {
    if (!formula || typeof formula !== 'string') return { success: true, value: 0 };

    type ConditionFunctionArg = number | string;
    const toConditionNumber = (value: ConditionFunctionArg): number =>
      typeof value === 'number' ? value : Number(value);
    const functionHandlers: Record<
      string,
      { minArgs: number; maxArgs: number; apply: (args: ConditionFunctionArg[]) => number }
    > = {
      abs: { minArgs: 1, maxArgs: 1, apply: args => Math.abs(toConditionNumber(args[0])) },
      floor: { minArgs: 1, maxArgs: 1, apply: args => Math.floor(toConditionNumber(args[0])) },
      min: {
        minArgs: 2,
        maxArgs: Number.POSITIVE_INFINITY,
        apply: args => Math.min(...args.map(toConditionNumber)),
      },
      max: {
        minArgs: 2,
        maxArgs: Number.POSITIVE_INFINITY,
        apply: args => Math.max(...args.map(toConditionNumber)),
      },
    };

    // 支持 $roll.hasTag("tag")
    if (context && context.$roll && typeof context.$roll === 'object') {
      const roll = context.$roll as RollResult;
      functionHandlers['$roll.hastag'] = {
        minArgs: 1,
        maxArgs: 1,
        apply: args => {
          const tag = String(args[0]);
          return (roll.tags ?? []).includes(tag) ? 1 : 0;
        },
      };
    }

    function evaluateExpression(expression: string): { success: boolean; value?: number | boolean; error?: string } {
      // 2. 安全检查
      // 检查是否包含非法字符
      const illegal = expression.match(/[^0-9+\-*/()><=!&| .]/g);
      if (illegal) {
        return { success: false, error: `包含非法字符: ${illegal.join('')}` };
      }

      // 3. 分词 (Tokenization)
      // 需要处理多字符运算符: >=, <=, ==, !=, &&, ||
      const tokens = [];
      let i = 0;
      while (i < expression.length) {
        const char = expression[i];
        if (/\s/.test(char)) {
          i++;
          continue;
        }
        if (/\d/.test(char)) {
          let num = '';
          while (i < expression.length && /[\d.]/.test(expression[i])) {
            num += expression[i++];
          }
          tokens.push({ type: 'NUMBER', value: parseFloat(num) });
          continue;
        }

        // 处理三字符操作符 (===, !==)
        const threeChar = expression.substring(i, i + 3);
        if (['===', '!=='].includes(threeChar)) {
          tokens.push({ type: 'OPERATOR', value: threeChar });
          i += 3;
          continue;
        }

        // 处理双字符操作符
        const twoChar = expression.substring(i, i + 2);
        if (['>=', '<=', '==', '!=', '&&', '||'].includes(twoChar)) {
          tokens.push({ type: 'OPERATOR', value: twoChar });
          i += 2;
          continue;
        }

        // 处理单字符操作符
        if (['+', '-', '*', '/', '%', '>', '<', '(', ')'].includes(char)) {
          // 处理一元负号：如果 '-' 出现在开头或紧跟在操作符/左括号后面，则是负号
          if (char === '-' || char === '+') {
            const lastToken = tokens[tokens.length - 1];
            const isUnary = !lastToken || lastToken.type === 'OPERATOR' || lastToken.value === '(';
            if (isUnary) {
              // 读取后面的数字
              let num = char;
              i++;
              while (i < expression.length && /[\d.]/.test(expression[i])) {
                num += expression[i++];
              }
              if (num.length > 1) {
                tokens.push({ type: 'NUMBER', value: parseFloat(num) });
                continue;
              }
              // 如果只有 '-' 没有数字，回退并作为操作符处理
              i--;
            }
          }
          if (char === '>' || char === '<') {
            const nextChar = expression[i + 1];
            if (nextChar === char) {
              // 处理 >> 或 <<
              return { success: false, error: `语法错误: 无法解析操作符 "${char}${char}"` };
            }
          }
          tokens.push({ type: 'OPERATOR', value: char });
          i++;
          continue;
        }

        // 捕获未处理的字符
        if (['=', '!', '&', '|'].includes(char)) {
          return { success: false, error: `语法错误: 孤立的操作符 "${char}"` };
        }
        return { success: false, error: `语法错误: 无法解析或孤立的字符 "${char}"` };
      }

      // 4. Shunting-yard 算法
      const ops = {
        '||': { prec: 1, assoc: 'L' },
        '&&': { prec: 2, assoc: 'L' },
        '==': { prec: 3, assoc: 'L' },
        '!=': { prec: 3, assoc: 'L' },
        '===': { prec: 3, assoc: 'L' },
        '!==': { prec: 3, assoc: 'L' },
        '>': { prec: 4, assoc: 'L' },
        '<': { prec: 4, assoc: 'L' },
        '>=': { prec: 4, assoc: 'L' },
        '<=': { prec: 4, assoc: 'L' },
        '+': { prec: 5, assoc: 'L' },
        '-': { prec: 5, assoc: 'L' },
        '*': { prec: 6, assoc: 'L' },
        '/': { prec: 6, assoc: 'L' },
        '%': { prec: 6, assoc: 'L' },
      };

      const outputQueue = [];
      const operatorStack = [];

      for (const token of tokens) {
        if (token.type === 'NUMBER') {
          outputQueue.push(token);
        } else if (token.value === '(') {
          operatorStack.push(token);
        } else if (token.value === ')') {
          while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1].value !== '(') {
            outputQueue.push(operatorStack.pop());
          }
          if (operatorStack.length === 0) return { success: false, error: '括号不匹配' };
          operatorStack.pop(); // 弹出 '('
        } else {
          const o1 = token.value;
          while (operatorStack.length > 0) {
            const o2 = operatorStack[operatorStack.length - 1].value;
            if (o2 === '(') break;
            if (ops[o2].prec > ops[o1].prec || (ops[o2].prec === ops[o1].prec && ops[o1].assoc === 'L')) {
              outputQueue.push(operatorStack.pop());
            } else {
              break;
            }
          }
          operatorStack.push(token);
        }
      }

      while (operatorStack.length > 0) {
        const op = operatorStack.pop();
        if (op.value === '(') return { success: false, error: '括号不匹配' };
        outputQueue.push(op);
      }

      // 5. 栈求值
      const evalStack = [];
      for (const token of outputQueue) {
        if (token.type === 'NUMBER') {
          evalStack.push(token.value);
        } else {
          const b = evalStack.pop();
          const a = evalStack.pop();
          let res;
          switch (token.value) {
            case '+':
              res = a + b;
              break;
            case '-':
              res = a - b;
              break;
            case '*':
              res = a * b;
              break;
            case '/':
              res = a / b;
              break;
            case '%':
              res = a % b;
              break;
            case '>':
              res = a > b;
              break;
            case '<':
              res = a < b;
              break;
            case '>=':
              res = a >= b;
              break;
            case '<=':
              res = a <= b;
              break;
            case '==':
              res = a == b;
              break;
            case '!=':
              res = a != b;
              break;
            case '===':
              res = a === b;
              break;
            case '!==':
              res = a !== b;
              break;
            case '&&':
              res = a && b ? 1 : 0;
              break;
            case '||':
              res = a || b ? 1 : 0;
              break;
            default:
              return { success: false, error: `未知操作符: ${token.value}` };
          }
          evalStack.push(res);
        }
      }

      if (evalStack.length !== 1) return { success: false, error: '无效的表达式' };
      return { success: true, value: evalStack[0] };
    }

    function normalizeNumberLiteral(value: number): string {
      const text = String(value);
      if (value < 0) return `(0${text})`;
      return `(${text})`;
    }

    function splitArguments(argsText: string): string[] {
      const args: string[] = [];
      let depth = 0;
      let start = 0;
      let inQuote = false;
      for (let index = 0; index < argsText.length; index++) {
        const char = argsText[index];
        if (char === '"' || char === "'") {
          inQuote = !inQuote;
        }
        if (inQuote) continue;

        if (char === '(') {
          depth++;
        } else if (char === ')') {
          depth--;
        } else if (char === ',' && depth === 0) {
          args.push(argsText.slice(start, index).trim());
          start = index + 1;
        }
      }
      args.push(argsText.slice(start).trim());
      return args;
    }

    function findMatchingParen(source: string, startIndex: number): number {
      let depth = 0;
      for (let index = startIndex; index < source.length; index++) {
        const char = source[index];
        if (char === '(') depth++;
        if (char === ')') {
          depth--;
          if (depth === 0) return index;
        }
      }
      return -1;
    }

    function evaluateArgumentValue(argExpr: string): {
      success: boolean;
      value?: ConditionFunctionArg;
      error?: string;
    } {
      const trimmed = argExpr.trim();
      if (!trimmed) return { success: false, error: '函数参数不能为空' };

      // 处理字符串字面量
      if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
        return { success: true, value: trimmed.slice(1, -1) };
      }

      // [修复] 先替换变量，再处理函数
      let exprWithVars = trimmed;
      const varPattern = /\$[a-zA-Z_]\w*/g;
      exprWithVars = exprWithVars.replace(varPattern, match => {
        const val = context[match];
        return typeof val === 'number' && !isNaN(val) ? String(val) : '0';
      });

      const resolved = resolveFunctions(exprWithVars);
      if (!resolved.success || resolved.expr === undefined) {
        return { success: false, error: resolved.error ?? '函数参数解析失败' };
      }

      const dicePattern = /\d*d(?:\d+|F)/i;
      if (dicePattern.test(resolved.expr)) {
        const formulaValue = evaluateFormula(resolved.expr, context);
        if (typeof formulaValue === 'number' && Number.isFinite(formulaValue)) {
          return { success: true, value: formulaValue };
        }
      }

      const evalResult = evaluateExpression(resolved.expr);
      if (!evalResult.success || evalResult.value === undefined) {
        return { success: false, error: evalResult.error ?? '函数参数计算失败' };
      }
      const value = typeof evalResult.value === 'boolean' ? (evalResult.value ? 1 : 0) : evalResult.value;
      if (typeof value !== 'number' || Number.isNaN(value)) {
        return { success: false, error: '函数参数不是有效数字' };
      }
      return { success: true, value };
    }

    function resolveFunctions(source: string): { success: boolean; expr?: string; error?: string } {
      let result = '';
      let index = 0;
      const isIdentifierStart = (char: string): boolean => /[a-zA-Z_]/.test(char);
      const isIdentifierChar = (char: string): boolean => /[a-zA-Z0-9_]/.test(char);

      while (index < source.length) {
        const char = source[index];
        if (isIdentifierStart(char)) {
          let name = char;
          index++;
          while (index < source.length && (isIdentifierChar(source[index]) || source[index] === '.')) {
            name += source[index];
            index++;
          }

          // 处理 true/false 布尔字面量
          const nameLower = name.toLowerCase();
          if (nameLower === 'true') {
            result += '1';
            continue;
          }
          if (nameLower === 'false') {
            result += '0';
            continue;
          }

          let nextIndex = index;
          while (nextIndex < source.length && /\s/.test(source[nextIndex])) {
            nextIndex++;
          }

          if (source[nextIndex] !== '(') {
            return { success: false, error: `未知函数或标识符: ${name}` };
          }

          const closeIndex = findMatchingParen(source, nextIndex);
          if (closeIndex === -1) return { success: false, error: '括号不匹配' };

          const argsText = source.slice(nextIndex + 1, closeIndex);
          const args = splitArguments(argsText);
          const key = name.toLowerCase();
          const handler = functionHandlers[key];
          if (!handler) return { success: false, error: `不支持的函数: ${name}` };
          if (args.length < handler.minArgs || args.length > handler.maxArgs) {
            return { success: false, error: `函数 ${name} 参数数量不合法` };
          }

          const values: ConditionFunctionArg[] = [];
          for (const arg of args) {
            if (!arg) return { success: false, error: `函数 ${name} 参数不能为空` };
            const valueResult = evaluateArgumentValue(arg);
            if (!valueResult.success || valueResult.value === undefined) {
              return { success: false, error: valueResult.error ?? `函数 ${name} 参数计算失败` };
            }
            values.push(valueResult.value);
          }

          const fnResult = handler.apply(values);
          if (!Number.isFinite(fnResult)) {
            return { success: false, error: `函数 ${name} 结果无效` };
          }
          result += normalizeNumberLiteral(fnResult);
          index = closeIndex + 1;
          continue;
        }

        result += char;
        index++;
      }

      return { success: true, expr: result };
    }

    // 1. 替换变量
    // 支持变量: $roll.total, $attr, $dc, $mod 等,未定义视为0
    // 特殊处理 $roll 对象
    if (context && context.$roll && typeof context.$roll === 'object') {
      const roll = context.$roll as RollResult;
      formula = formula.replace(/\$roll\.total/g, String(roll.total));
      // 预处理 $roll.hasTag('tagName') 调用，在变量替换前完成
      formula = formula.replace(/\$roll\.hasTag\s*\(\s*['"]([^'"]+)['"]\s*\)/gi, (_match, tag) => {
        return (roll.tags ?? []).includes(tag) ? '1' : '0';
      });
    }

    const varPattern = /\$[a-zA-Z_]\w*/g;
    let expr = formula.trim().replace(varPattern, match => {
      const val = context[match];
      return typeof val === 'number' && !isNaN(val) ? String(val) : '0';
    });

    const resolved = resolveFunctions(expr);
    if (!resolved.success || resolved.expr === undefined) {
      return { success: false, error: resolved.error ?? '函数解析失败' };
    }
    expr = resolved.expr;

    return evaluateExpression(expr);
  };

  const evaluateConditionNumber = (formula: string, context: Record<string, number>, fallback = 0): number => {
    const result = evaluateCondition(formula, context);
    if (!result.success) return fallback;
    if (typeof result.value === 'number' && Number.isFinite(result.value)) return result.value;
    return result.value ? 1 : 0;
  };

  /**
   * 判断条件表达式是否为复杂条件 (包含 && 或 ||)
   * @param expr - 条件表达式字符串
   * @returns 如果包含 && 或 || 返回 true, 否则返回 false
   */
  const isComplexCondition = (expr: string): boolean => {
    return /(\&\&|\|\|)/.test(expr);
  };

  /**
   * 评估多级结果
   * @param outcomes - outcomes 数组 (会被排序)
   * @param context - 上下文对象 {$roll, $attr, $dc, $mod, ...}
   * @returns 匹配的 outcome (如果所有条件都不满足,返回最低优先级的兜底 outcome)
   */
  const evaluateOutcomes = (outcomes: OutcomeLevel[], context: Record<string, number>) => {
    if (!outcomes || outcomes.length === 0) {
      console.warn('[DICE] outcomes 数组为空,使用默认判定');
      return { id: 'default', name: '判定结果', condition: 'true', priority: 99 };
    }
    const sorted = [...outcomes].sort((a, b) => a.priority - b.priority);

    for (const outcome of sorted) {
      try {
        const conditionResult: { success: boolean; value?: number | boolean; error?: string } = evaluateCondition(
          outcome.condition,
          context,
        );
        if (!conditionResult.success) {
          if (conditionResult.error) {
            console.warn(`[DICE] outcome "${outcome.name}" 条件评估失败:`, conditionResult.error);
          }
          continue;
        }
        const isMatch =
          typeof conditionResult.value === 'number' ? conditionResult.value !== 0 : Boolean(conditionResult.value);
        if (isMatch) {
          return outcome;
        }
      } catch (error) {
        console.warn(`[DICE] outcome "${outcome.name}" 条件评估失败:`, error);
        continue;
      }
    }

    return sorted[sorted.length - 1];
  };

  // 默认输出模板
  const DEFAULT_OUTPUT_TEMPLATE = `<meta:检定结果>
$outcomeText
元叙事：$initiator 发起了 $attrName 检定，$formula=$roll，判定 $conditionExpr？$judgeResult，判定为【$outcomeName】
</meta:检定结果>`;

  // 默认对抗检定输出模板
  const DEFAULT_CONTEST_OUTPUT_TEMPLATE = `<meta:检定结果>
元叙事：进行了一次【$initiator $initAttrName vs $opponent $oppAttrName】的对抗检定。
$initiator $initAttrName：$initFormula=$initRoll，判定 $initConditionExpr？$initJudgeResult，判定为【$initSuccessName】；
$opponent $oppAttrName：$oppFormula=$oppRoll，判定 $oppConditionExpr？$oppJudgeResult，判定为【$oppSuccessName】。
最终结果：【$winner】
</meta:检定结果>`;

  /**
   * 格式化输出模板
   * @param template - 模板字符串
   * @param context - 变量上下文
   * @returns 格式化后的文本
   */
  const formatOutputTemplate = (template: string, context: Record<string, string | number | undefined>): string => {
    const missingKeys = new Set<string>();

    // [修复] 先替换带点的变量（如 $roll.total），再替换普通变量（如 $roll）
    // 这样可以避免 $roll.total 被错误地替换为 "3.total"
    let result = template.replace(/\$([a-zA-Z_]\w*\.[a-zA-Z_]\w*)/g, match => {
      const key = match.slice(1); // 去掉 $ 前缀，得到 "roll.total"
      const value = context[key];
      if (value === undefined || value === null) {
        if (!missingKeys.has(key)) {
          missingKeys.add(key);
          console.warn(`[DICE] formatOutputTemplate: 未定义变量 $${key}`);
        }
        return '';
      }
      return String(value);
    });

    // 再替换普通变量
    result = result.replace(/\$([a-zA-Z_]\w*)(?=\W|$)/g, match => {
      const key = match.slice(1);
      const value = context[key];
      if (value === undefined || value === null) {
        if (!missingKeys.has(key)) {
          missingKeys.add(key);
          console.warn(`[DICE] formatOutputTemplate: 未定义变量 $${key}`);
        }
        return '';
      }
      return String(value);
    });
    // 清理空行：将连续多个换行符替换为单个换行符
    return result.replace(/\n\s*\n/g, '\n');
  };

  /**
   * 生成单个属性值，应用范围限制
   * @param formula 公式字符串
   * @param range 可选范围 [min, max]
   * @param context 变量上下文
   * @returns 属性值
   */
  const generateAttributeValue = (formula, range, context) => {
    let value = evaluateFormula(formula, context);

    if (range && Array.isArray(range) && range.length === 2) {
      value = Math.max(range[0], Math.min(range[1], value));
    }

    return value;
  };
export {
  rollDiceExpression,
  calculateDiceExpectedValue,
  rollComplexDiceExpression,
  evaluateFormula,
  evaluateCondition,
  evaluateConditionNumber,
  isComplexCondition,
  evaluateOutcomes,
  DEFAULT_OUTPUT_TEMPLATE,
  DEFAULT_CONTEST_OUTPUT_TEMPLATE,
  formatOutputTemplate,
  generateAttributeValue,
};
