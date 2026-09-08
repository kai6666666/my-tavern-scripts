// @ts-nocheck
/**
 * features/dice/dice-engine.ts
 * 骰子表达式求值引擎（纯逻辑，无 DOM/DB 依赖）。
 */
import type { RollResult } from '../../shared/types';

  // ========================================
  // 公式解析器系统（支持骰子表达式和变量引用）
  // ========================================

  /**
   * 投单个骰子表达式
   * 支持: 3d6, 4d6kh3, 4d6dl1, 4d6dh1
   * @returns 标准化 RollResult，解析失败 total 为 NaN
   */
export const rollDiceExpression = (expr: string): RollResult => {
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
export const rollComplexDiceExpression = (expr: string): RollResult => {
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
