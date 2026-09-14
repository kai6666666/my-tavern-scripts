// @ts-nocheck
/**
 * builtin-attribute-presets.ts
 * Feature-Sliced 模块（数据常量）。
 */
import { PRESET_FORMAT_VERSION } from '../../shared/constants';
import { ATTRIBUTE_QUICK_SELECT_DEFAULT, ATTRIBUTE_QUICK_SELECT_DND } from './attribute-quick-select-defaults';

export const BUILTIN_ATTRIBUTE_PRESETS = [
    {
      format: 'acu_attr_preset_v1',
      version: PRESET_FORMAT_VERSION,
      id: 'coc7',
      name: '简化COC规则',
      builtin: true,
      description: '基于克苏鲁的呼唤第7版规则的属性预设。包含9条基本属性和18条特殊属性。',
      quickSelect: ATTRIBUTE_QUICK_SELECT_DEFAULT,
      baseAttributes: [
        { name: '力量', formula: '3d6*5', range: [15, 90], modifier: '1d10-5' },
        { name: '体质', formula: '3d6*5', range: [15, 90], modifier: '1d10-5' },
        { name: '体型', formula: '2d6*5+30', range: [40, 90], modifier: '1d10-5' },
        { name: '敏捷', formula: '3d6*5', range: [15, 90], modifier: '1d10-5' },
        { name: '外貌', formula: '3d6*5', range: [15, 90], modifier: '1d10-5' },
        { name: '意志', formula: '3d6*5', range: [15, 90], modifier: '1d10-5' },
        { name: '幸运', formula: '3d6*5', range: [15, 90], modifier: '1d10-5' },
        { name: '智力', formula: '2d6*5+30', range: [40, 90], modifier: '1d10-5' },
        { name: '教育', formula: '2d6*5+30', range: [40, 90], modifier: '1d10-5' },
      ],
      specialAttributes: [
        // 高频核心技能（范围 15-110，限制到95，平均60）
        { name: '侦查', formula: '10+5d20', range: [15, 95] },
        { name: '聆听', formula: '10+5d20', range: [15, 95] },
        { name: '心理学', formula: '10+5d20', range: [15, 95] },
        // 中频常用技能（范围 9-85，平均47）
        { name: '说服', formula: '5+4d20', range: [9, 85] },
        { name: '话术', formula: '5+4d20', range: [9, 85] },
        { name: '潜行', formula: '5+4d20', range: [9, 85] },
        { name: '格斗', formula: '5+4d20', range: [9, 85] },
        { name: '射击', formula: '5+4d20', range: [9, 85] },
        { name: '信用评级', formula: '5+4d20', range: [9, 85] },
        // 低频辅助技能（范围 8-65，平均36）
        { name: '魅惑', formula: '5+3d20', range: [8, 65] },
        { name: '恐吓', formula: '5+3d20', range: [8, 65] },
        { name: '图书馆使用', formula: '5+3d20', range: [8, 65] },
        { name: '急救', formula: '5+3d20', range: [8, 65] },
        { name: '驾驶', formula: '5+3d20', range: [8, 65] },
        // 极低稀有技能（范围 3-41，平均22）
        { name: '神秘学', formula: '1+2d20', range: [3, 41] },
        // 公式计算
        { name: '闪避', formula: '敏捷/2', range: [1, 99] },
        // COC 特色
        { name: 'SAN值', formula: '意志', range: [1, 99] },
        { name: '克苏鲁神话', formula: '1d5', range: [1, 5] },
      ],
    },
    {
      format: 'acu_attr_preset_v1',
      version: PRESET_FORMAT_VERSION,
      id: 'dnd5e',
      name: '简化DND规则',
      builtin: true,
      description:
        '基于龙与地下城第5版规则的属性预设。包含6条基本属性和19条技能/派生属性。技能使用长尾分布：多数人为0或负值，少数专家可达+10以上。',
      quickSelect: ATTRIBUTE_QUICK_SELECT_DND,
      baseAttributes: [
        { name: '力量', formula: '4d6dl1', range: [3, 18], modifier: '1d4-2' },
        { name: '敏捷', formula: '4d6dl1', range: [3, 18], modifier: '1d4-2' },
        { name: '体质', formula: '4d6dl1', range: [3, 18], modifier: '1d4-2' },
        { name: '智力', formula: '4d6dl1', range: [3, 18], modifier: '1d4-2' },
        { name: '感知', formula: '4d6dl1', range: [3, 18], modifier: '1d4-2' },
        { name: '魅力', formula: '4d6dl1', range: [3, 18], modifier: '1d4-2' },
      ],
      specialAttributes: [
        // DND5e 18个技能 - 使用 NdMkl1-X 公式实现长尾分布
        // 原理：取多个骰子的最低值，低值常见、高值稀有
        // 例如 4d8kl1-3: 范围 -2 到 +5，大部分人在 -2~+1，少数专家能到 +5

        // 力量系技能
        { name: '运动', formula: '4d8kl1-3', range: [-2, 5] }, // 范围 -2 到 +5
        // 敏捷系技能
        { name: '杂技', formula: '4d8kl1-3', range: [-2, 5] },
        { name: '巧手', formula: '4d8kl1-3', range: [-2, 5] },
        { name: '隐匿', formula: '5d10kl1-4', range: [-3, 6] }, // 高频，长尾更长
        // 智力系技能
        { name: '奥秘', formula: '3d6kl1-2', range: [-1, 4] }, // 稀有技能，范围小
        { name: '历史', formula: '3d6kl1-2', range: [-1, 4] },
        { name: '调查', formula: '4d8kl1-3', range: [-2, 5] },
        { name: '自然', formula: '3d6kl1-2', range: [-1, 4] },
        { name: '宗教', formula: '3d6kl1-2', range: [-1, 4] },
        // 感知系技能
        { name: '驯兽', formula: '3d6kl1-2', range: [-1, 4] },
        { name: '洞悉', formula: '5d10kl1-4', range: [-3, 6] }, // 高频
        { name: '医药', formula: '3d6kl1-2', range: [-1, 4] },
        { name: '察觉', formula: '5d10kl1-4', range: [-3, 6] }, // 高频，长尾更长
        { name: '求生', formula: '3d6kl1-2', range: [-1, 4] },
        // 魅力系技能
        { name: '欺瞒', formula: '4d8kl1-3', range: [-2, 5] },
        { name: '威吓', formula: '4d8kl1-3', range: [-2, 5] },
        { name: '表演', formula: '3d6kl1-2', range: [-1, 4] },
        { name: '游说', formula: '4d8kl1-3', range: [-2, 5] },
        // 派生属性
        { name: '先攻', formula: 'floor((敏捷-10)/2)', range: [-4, 4] },
      ],
    },
  ];
