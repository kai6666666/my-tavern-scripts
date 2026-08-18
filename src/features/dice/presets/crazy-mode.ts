// @ts-nocheck
// 来源：src/features/dice/index.ts 章节 idx=27「疯狂模式系统」
// 原行范围：16539-16875（含 banner 16534-16875）；拆分批次 8；外部 closure 依赖：13（Store@29 / STORAGE_KEY_CRAZY_MODE@3 / DEFAULT_CRAZY_MODE_CONFIG@3 / cachedRawData@29 / getTableData@30 / processJsonData@30 / DashboardDataParser@29 / getDisplayPlayerName@19 / getFullAttributesForCharacter@29 / AttributePresetManager@23 / getRandomSkillPool@29 / rollComplexDiceExpression@28 / AdvancedDicePresetManager@24）
// 接线说明：STORAGE_KEY_CRAZY_MODE/DEFAULT_CRAZY_MODE_CONFIG 已拆至 engine/preset-constants.ts、getDisplayPlayerName 已拆至 favorites/favorites-manager.ts、
//   AttributePresetManager 已拆至 presets/attribute-rule-preset.ts、rollComplexDiceExpression 已拆至 engine/formula-parser.ts、
//   AdvancedDicePresetManager 已拆至 presets/advanced-dice-preset-manager.ts（均不引用本文件，无循环）直接 import；
//   Store/cachedRawData/DashboardDataParser/getFullAttributesForCharacter/getRandomSkillPool@29、getTableData/processJsonData@30 定义于 index.ts IIFE 内无法 export，采用运行时注入：
//   index.ts IIFE 末尾调用 __wireCrazyModeDeps({...}) 注入；
//   未注入时模块级引用为 null（全部仅在运行时函数内调用，注入先于任何调用，与 IIFE 内原时序等价）。
//   AdvancedDicePreset 仅作类型标注，import type 引入（esbuild 剥离，无运行时依赖）。

import { DEFAULT_CRAZY_MODE_CONFIG, STORAGE_KEY_CRAZY_MODE } from '../engine/preset-constants';
import { getDisplayPlayerName } from '../favorites/favorites-manager';
import { AttributePresetManager } from './attribute-rule-preset';
import { rollComplexDiceExpression } from '../engine/formula-parser';
import { AdvancedDicePresetManager } from './advanced-dice-preset-manager';
import type { AdvancedDicePreset } from './advanced-dice-preset';

let Store = null;
let cachedRawData = null;
let getTableData = null;
let processJsonData = null;
let DashboardDataParser = null;
let getFullAttributesForCharacter = null;
let getRandomSkillPool = null;

export function __wireCrazyModeDeps(deps) {
  Store = deps.Store;
  cachedRawData = deps.cachedRawData;
  getTableData = deps.getTableData;
  processJsonData = deps.processJsonData;
  DashboardDataParser = deps.DashboardDataParser;
  getFullAttributesForCharacter = deps.getFullAttributesForCharacter;
  getRandomSkillPool = deps.getRandomSkillPool;
}
  // ========================================
  // 疯狂模式系统
  // ========================================

  // 获取疯狂模式配置
  const getCrazyModeConfig = () => {
    const stored = Store.get(STORAGE_KEY_CRAZY_MODE, null);
    if (!stored) return { ...DEFAULT_CRAZY_MODE_CONFIG };
    return { ...DEFAULT_CRAZY_MODE_CONFIG, ...stored };
  };

  // 保存疯狂模式配置
  const saveCrazyModeConfig = config => {
    Store.set(STORAGE_KEY_CRAZY_MODE, config);
  };

  // 判断是否触发疯狂模式
  const shouldTriggerCrazyMode = () => {
    const config = getCrazyModeConfig();
    if (!config.enabled) return false;
    // crazyLevel 作为触发概率百分比
    const roll = Math.random() * 100;
    return roll < config.crazyLevel;
  };

  // 选择投骰类型
  const selectCrazyRollType = crazyLevel => {
    // crazyLevel < 50: 100% 普通检定
    // crazyLevel 50-75: 70% 普通 / 30% 对抗
    // crazyLevel > 75: 50% 普通 / 50% 对抗
    if (crazyLevel < 50) return 'normal';
    const contestChance = crazyLevel <= 75 ? 0.3 : 0.5;
    return Math.random() < contestChance ? 'contest' : 'normal';
  };

  // 根据权重随机选择
  const weightedRandomSelect = items => {
    if (!items || items.length === 0) return null;
    const totalWeight = items.reduce((sum, item) => sum + (item.weight || 1), 0);
    let random = Math.random() * totalWeight;
    for (const item of items) {
      random -= item.weight || 1;
      if (random <= 0) return item;
    }
    return items[items.length - 1];
  };

  // 选择参与者
  const selectCrazyParticipant = () => {
    const config = getCrazyModeConfig();
    const rawData = cachedRawData || getTableData();
    if (!rawData) return null;

    const allTables = processJsonData(rawData || {});
    const playerResult = DashboardDataParser.findTable(allTables, 'player');
    const npcResult = DashboardDataParser.findTable(allTables, 'npc');

    // 构建候选列表
    const candidates = [];

    // 主角
    if (playerResult?.data?.rows?.length > 0) {
      const playerName = getDisplayPlayerName() || '主角';
      const playerAttrs = getFullAttributesForCharacter('<user>');
      candidates.push({
        name: playerName,
        attrs: playerAttrs,
        isPlayer: true,
        inScene: true,
        weight: config.playerWeight,
      });
    }

    // NPC
    if (npcResult) {
      const npcParsed = DashboardDataParser.parseRows(npcResult, 'npc');
      npcParsed.forEach(npc => {
        if (!npc.name) return;
        const inSceneVal = String(npc.inScene || '').toLowerCase();
        const isInScene = inSceneVal === 'true' || inSceneVal === '在场';
        const npcAttrs = getFullAttributesForCharacter(npc.name);
        candidates.push({
          name: npc.name,
          attrs: npcAttrs,
          isPlayer: false,
          inScene: isInScene,
          weight: isInScene ? config.inSceneNpcWeight : config.offSceneNpcWeight,
        });
      });
    }

    if (candidates.length === 0) return null;
    return weightedRandomSelect(candidates);
  };

  // 选择检定属性
  const selectCrazyAttribute = participant => {
    if (!participant) return { name: '幸运', value: 50 };

    // 1. 优先使用角色已有属性
    if (participant.attrs && participant.attrs.length > 0) {
      const randomAttr = participant.attrs[Math.floor(Math.random() * participant.attrs.length)];
      return { name: randomAttr.name, value: randomAttr.value };
    }

    // 2. 使用当前属性规则定义的属性
    const activePreset = AttributePresetManager.getActivePreset();
    if (activePreset) {
      const allPresetAttrs = [...(activePreset.baseAttributes || []), ...(activePreset.specialAttributes || [])];
      if (allPresetAttrs.length > 0) {
        const randomPresetAttr = allPresetAttrs[Math.floor(Math.random() * allPresetAttrs.length)];
        // 使用 range 的 50% 作为默认值
        const range = randomPresetAttr.range || [0, 100];
        const defaultValue = Math.floor((range[0] + range[1]) / 2);
        return { name: randomPresetAttr.name, value: defaultValue };
      }
    }

    // 3. 使用随机技能池
    const skillPool = getRandomSkillPool();
    if (skillPool && skillPool.length > 0) {
      const randomSkill = skillPool[Math.floor(Math.random() * skillPool.length)];
      return { name: randomSkill, value: 50 };
    }

    return { name: '幸运', value: 50 };
  };

  // 根据预设执行疯狂模式投骰
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

  // 判断检定结果 (保留用于无预设时的兼容)
  const judgeCrazyRollResult = (roll, target) => {
    if (roll <= 5) return '大成功';
    if (roll >= 96) return '大失败';
    if (roll <= target) return '成功';
    return '失败';
  };

  // 生成疯狂骰子结果
  const generateCrazyRoll = () => {
    const config = getCrazyModeConfig();
    const rollType = selectCrazyRollType(config.crazyLevel);

    // 获取当前激活的检定预设
    const activePreset = AdvancedDicePresetManager.getActivePreset();

    if (rollType === 'normal') {
      // 普通检定
      const participant = selectCrazyParticipant();
      if (!participant) return null;

      const attr = selectCrazyAttribute(participant);
      const rollData = crazyRollWithPreset(activePreset, attr.value);

      // 根据预设类型格式化输出
      if (activePreset) {
        const presetName = activePreset.name;
        if (activePreset.id === 'dnd5e_check' && rollData.attrMod !== undefined) {
          return `<meta:检定结果>\n元叙事：${participant.name}发起了【${attr.name}】检定(${presetName})，${rollData.formula}=${rollData.roll}，调整值${rollData.attrMod >= 0 ? '+' : ''}${rollData.attrMod}，总计${rollData.total}，DC${rollData.dc}，【${rollData.result}】\n</meta:检定结果>`;
        } else if (rollData.total !== undefined) {
          return `<meta:检定结果>\n元叙事：${participant.name}发起了【${attr.name}】检定(${presetName})，${rollData.formula}=${rollData.roll}，总计${rollData.total}，【${rollData.result}】\n</meta:检定结果>`;
        } else {
          return `<meta:检定结果>\n元叙事：${participant.name}发起了【${attr.name}】检定(${presetName})，${rollData.formula}=${rollData.roll}，目标${attr.value}，【${rollData.result}】\n</meta:检定结果>`;
        }
      }

      // 无预设时使用默认格式
      return `<meta:检定结果>\n元叙事：${participant.name}发起了【${attr.name}】检定，掷出${rollData.roll}，目标${attr.value}，【${rollData.result}】\n</meta:检定结果>`;
    } else {
      // 对抗检定
      const participant1 = selectCrazyParticipant();
      if (!participant1) return null;

      // 选择第二个参与者（排除第一个）
      let participant2 = null;
      for (let i = 0; i < 5; i++) {
        const candidate = selectCrazyParticipant();
        if (candidate && candidate.name !== participant1.name) {
          participant2 = candidate;
          break;
        }
      }

      // 如果找不到第二个参与者，降级为普通检定
      if (!participant2) {
        const attr = selectCrazyAttribute(participant1);
        const rollData = crazyRollWithPreset(activePreset, attr.value);
        if (activePreset) {
          return `<meta:检定结果>\n元叙事：${participant1.name}发起了【${attr.name}】检定(${activePreset.name})，${rollData.formula}=${rollData.roll}，目标${attr.value}，【${rollData.result}】\n</meta:检定结果>`;
        }
        return `<meta:检定结果>\n元叙事：${participant1.name}发起了【${attr.name}】检定，掷出${rollData.roll}，目标${attr.value}，【${rollData.result}】\n</meta:检定结果>`;
      }

      const attr1 = selectCrazyAttribute(participant1);
      const attr2 = selectCrazyAttribute(participant2);
      const rollData1 = crazyRollWithPreset(activePreset, attr1.value);
      const rollData2 = crazyRollWithPreset(activePreset, attr2.value);

      // 计算成功度和判定结果
      const result1 = rollData1.result;
      const result2 = rollData2.result;

      // 根据预设类型计算胜负
      let winner;
      if (
        activePreset &&
        (activePreset.id === 'dnd5e_check' || activePreset.id === 'pbta_check' || activePreset.id === 'fate_check')
      ) {
        // 加值系统: 比较总值
        const total1 = rollData1.total !== undefined ? rollData1.total : rollData1.roll + attr1.value;
        const total2 = rollData2.total !== undefined ? rollData2.total : rollData2.roll + attr2.value;
        if (total1 > total2) {
          winner = `${participant1.name}胜出`;
        } else if (total2 > total1) {
          winner = `${participant2.name}胜出`;
        } else {
          winner = '平局';
        }
      } else {
        // d100系统: 比较成功余量 (目标值 - 投骰结果)
        const margin1 = attr1.value - rollData1.roll;
        const margin2 = attr2.value - rollData2.roll;
        if (margin1 > margin2) {
          winner = `${participant1.name}胜出`;
        } else if (margin2 > margin1) {
          winner = `${participant2.name}胜出`;
        } else {
          winner = '平局';
        }
      }

      // 格式与现有对抗检定保持一致
      const presetLabel = activePreset ? `(${activePreset.name})` : '';
      return (
        `<meta:检定结果>\n` +
        `元叙事：进行了一次【${participant1.name} ${attr1.name} vs ${participant2.name} ${attr2.name}】的对抗检定${presetLabel}。` +
        `${participant1.name} ${attr1.name} (目标${attr1.value}) ${rollData1.formula}=${rollData1.roll}，判定为【${result1}】；` +
        `${participant2.name} ${attr2.name} (目标${attr2.value}) ${rollData2.formula}=${rollData2.roll}，判定为【${result2}】。` +
        `最终结果：【${winner}】\n` +
        `</meta:检定结果>`
      );
    }
  };
export {
  getCrazyModeConfig,
  saveCrazyModeConfig,
  shouldTriggerCrazyMode,
  selectCrazyRollType,
  weightedRandomSelect,
  selectCrazyParticipant,
  selectCrazyAttribute,
  crazyRollWithPreset,
  judgeCrazyRollResult,
  generateCrazyRoll,
}; // __wireCrazyModeDeps 已由头部 export function 导出
