// @ts-nocheck
/**
 * generate-crazy-roll.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGenerateCrazyRoll(deps: any) {
  const generateCrazyRoll = () => {
    const config = deps.getCrazyModeConfig();
    const rollType = deps.selectCrazyRollType(config.crazyLevel);

    // 获取当前激活的检定预设
    const activePreset = deps.AdvancedDicePresetManager.getActivePreset();

    if (rollType === 'normal') {
      // 普通检定
      const participant = deps.selectCrazyParticipant();
      if (!participant) return null;

      const attr = deps.selectCrazyAttribute(participant);
      const rollData = deps.crazyRollWithPreset(activePreset, attr.value);

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
      const participant1 = deps.selectCrazyParticipant();
      if (!participant1) return null;

      // 选择第二个参与者（排除第一个）
      let participant2 = null;
      for (let i = 0; i < 5; i++) {
        const candidate = deps.selectCrazyParticipant();
        if (candidate && candidate.name !== participant1.name) {
          participant2 = candidate;
          break;
        }
      }

      // 如果找不到第二个参与者，降级为普通检定
      if (!participant2) {
        const attr = deps.selectCrazyAttribute(participant1);
        const rollData = deps.crazyRollWithPreset(activePreset, attr.value);
        if (activePreset) {
          return `<meta:检定结果>\n元叙事：${participant1.name}发起了【${attr.name}】检定(${activePreset.name})，${rollData.formula}=${rollData.roll}，目标${attr.value}，【${rollData.result}】\n</meta:检定结果>`;
        }
        return `<meta:检定结果>\n元叙事：${participant1.name}发起了【${attr.name}】检定，掷出${rollData.roll}，目标${attr.value}，【${rollData.result}】\n</meta:检定结果>`;
      }

      const attr1 = deps.selectCrazyAttribute(participant1);
      const attr2 = deps.selectCrazyAttribute(participant2);
      const rollData1 = deps.crazyRollWithPreset(activePreset, attr1.value);
      const rollData2 = deps.crazyRollWithPreset(activePreset, attr2.value);

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
  return generateCrazyRoll;
}
