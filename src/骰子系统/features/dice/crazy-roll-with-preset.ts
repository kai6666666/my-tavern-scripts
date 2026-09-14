// @ts-nocheck
/**
 * crazy-roll-with-preset.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { rollComplexDiceExpression } from './dice-engine';
export function createCrazyRollWithPreset(deps: any) {
  const crazyRollWithPreset = (preset: AdvancedDicePreset | null, attrValue: number) => {
    if (!preset) {
      // 没有激活预设时，使用默认 d100 规则
      const roll = Math.floor(Math.random() * 100) + 1;
      let result = '失败';
      if (roll <= 5) result = '大成功';
      else if (roll >= 96) result = '大失败';
      else if (roll <= attrValue) result = '成功';
      return { roll, result, formula: '1d100' };
    }

    // 使用预设的骰子表达式
    const diceExpr = preset.diceExpression || '1d100';
    const rollResult = rollComplexDiceExpression(diceExpr);
    const rollTotal = rollResult.total;

    // 根据预设的 outcomes 判定结果
    if (preset.outcomes && preset.outcomes.length > 0) {
      // 简化的条件判断：根据预设类型进行基本判定
      const presetId = preset.id;

      if (presetId === 'dnd5e_check') {
        // DND5e: 1d20 + 调整值 >= DC
        // 调整值 = floor((属性值-10)/2)
        const attrMod = Math.floor((attrValue - 10) / 2);
        const dc = 10; // 默认DC
        const total = rollTotal + attrMod;

        if (rollResult.rawDice && rollResult.rawDice[0] === 20) {
          return { roll: rollTotal, result: '大成功', formula: diceExpr, total, dc, attrMod };
        } else if (rollResult.rawDice && rollResult.rawDice[0] === 1) {
          return { roll: rollTotal, result: '大失败', formula: diceExpr, total, dc, attrMod };
        } else if (total >= dc) {
          return { roll: rollTotal, result: '成功', formula: diceExpr, total, dc, attrMod };
        } else {
          return { roll: rollTotal, result: '失败', formula: diceExpr, total, dc, attrMod };
        }
      } else if (presetId === 'coc7_check') {
        // CoC7: 1d100 <= 属性值
        if (rollTotal === 1) {
          return { roll: rollTotal, result: '大成功', formula: diceExpr };
        } else if ((attrValue < 50 && rollTotal >= 96) || (attrValue >= 50 && rollTotal === 100)) {
          return { roll: rollTotal, result: '大失败', formula: diceExpr };
        } else if (rollTotal <= Math.floor(attrValue / 5)) {
          return { roll: rollTotal, result: '极难成功', formula: diceExpr };
        } else if (rollTotal <= Math.floor(attrValue / 2)) {
          return { roll: rollTotal, result: '困难成功', formula: diceExpr };
        } else if (rollTotal <= attrValue) {
          return { roll: rollTotal, result: '成功', formula: diceExpr };
        } else {
          return { roll: rollTotal, result: '失败', formula: diceExpr };
        }
      } else if (presetId === 'fate_check') {
        // 命运骰: 4dF + 属性值
        const total = rollTotal + attrValue;
        const dc = 0; // 默认DC
        if (total >= dc + 3) {
          return { roll: rollTotal, result: '大成功', formula: diceExpr, total };
        } else if (total >= dc) {
          return { roll: rollTotal, result: '成功', formula: diceExpr, total };
        } else if (total >= dc - 2) {
          return { roll: rollTotal, result: '失败', formula: diceExpr, total };
        } else {
          return { roll: rollTotal, result: '大失败', formula: diceExpr, total };
        }
      } else if (presetId === 'pbta_check') {
        // PbtA: 2d6 + 属性值
        const total = rollTotal + attrValue;
        if (total >= 10) {
          return { roll: rollTotal, result: '完全成功', formula: diceExpr, total };
        } else if (total >= 7) {
          return { roll: rollTotal, result: '部分成功', formula: diceExpr, total };
        } else {
          return { roll: rollTotal, result: '失败', formula: diceExpr, total };
        }
      }
    }

    // 通用判定逻辑：根据骰子类型自动选择成功条件
    if (diceExpr.includes('d100') || diceExpr.includes('D100')) {
      // d100 系统: 投骰结果 <= 目标值 为成功
      if (rollTotal <= 5) return { roll: rollTotal, result: '大成功', formula: diceExpr };
      if (rollTotal >= 96) return { roll: rollTotal, result: '大失败', formula: diceExpr };
      if (rollTotal <= attrValue) return { roll: rollTotal, result: '成功', formula: diceExpr };
      return { roll: rollTotal, result: '失败', formula: diceExpr };
    } else if (diceExpr.includes('d20') || diceExpr.includes('D20')) {
      // d20 系统: 投骰结果 + 修正 >= DC 为成功
      const dc = 10;
      if (rollTotal === 20) return { roll: rollTotal, result: '大成功', formula: diceExpr };
      if (rollTotal === 1) return { roll: rollTotal, result: '大失败', formula: diceExpr };
      if (rollTotal + attrValue >= dc) return { roll: rollTotal, result: '成功', formula: diceExpr };
      return { roll: rollTotal, result: '失败', formula: diceExpr };
    } else {
      // 其他骰子: 简单判断高低
      const midValue = attrValue;
      if (rollTotal >= midValue) return { roll: rollTotal, result: '成功', formula: diceExpr };
      return { roll: rollTotal, result: '失败', formula: diceExpr };
    }
  };
  return crazyRollWithPreset;
}
