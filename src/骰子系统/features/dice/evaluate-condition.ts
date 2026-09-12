// @ts-nocheck
/**
 * evaluate-condition.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createEvaluateCondition(deps: any) {
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
        const formulaValue = deps.evaluateFormula(resolved.expr, context);
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
  return evaluateCondition;
}
