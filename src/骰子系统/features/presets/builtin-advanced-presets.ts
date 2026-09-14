// @ts-nocheck
/**
 * builtin-advanced-presets.ts
 * Feature-Sliced 模块（数据常量）。
 */
import { PRESET_FORMAT_VERSION } from '../../shared/constants';
import { COC7_CHECK_SUGGESTION_ALIASES, COC7_CHECK_SUGGESTION_GUIDE, COC7_GROWTH_CHECK_SUGGESTION_GUIDE, DND5E_CHECK_SUGGESTION_ALIASES, DND5E_CHECK_SUGGESTION_GUIDE, FATE_CHECK_SUGGESTION_GUIDE, PBTA_CHECK_SUGGESTION_GUIDE, TRIANGLE_AGENCY_CHECK_SUGGESTION_GUIDE } from './builtin-check-suggestion-guides';

export const BUILTIN_ADVANCED_PRESETS: AdvancedDicePreset[] = [
    // CoC7 规则: 1d100 <= 属性值
    {
      kind: 'advanced',
      id: 'coc7_check',
      name: 'CoC7',
      description: '克苏鲁的呼唤7版: 1d100 <= 属性值即成功',
      version: PRESET_FORMAT_VERSION,
      builtin: true,
      checkSuggestionGuide: COC7_CHECK_SUGGESTION_GUIDE,
      checkSuggestionAliases: COC7_CHECK_SUGGESTION_ALIASES,
      diceExpression: '1d100',
      attribute: {
        label: '技能值',
        placeholder: '留空=50',
        defaultValue: 50,
        key: '技能值',
      },
      dc: {
        hidden: true,
        defaultValue: 0,
      },
      mod: {
        hidden: true,
        defaultValue: 0,
      },
      customFields: [
        {
          id: 'bonusPenalty',
          type: 'number',
          label: '奖惩骰',
          defaultValue: '',
          placeholder: '+1 奖励, -1 惩罚',
        },
        {
          id: 'requiredRank',
          type: 'select',
          label: '最低成功等级',
          defaultValue: 1,
          options: [
            { label: '成功', value: 1 },
            { label: '困难成功', value: 2 },
            { label: '极难成功', value: 3 },
          ],
          contestOverride: { hidden: true },
        },
      ],
      derivedVars: [{ id: 'absBp', expr: 'abs($bonusPenalty)' }],
      dicePatches: [
        { when: '$bonusPenalty > 0', op: 'append', template: 'b$absBp' },
        { when: '$bonusPenalty < 0', op: 'append', template: 'p$absBp' },
      ],
      effectsConfig: {
        triggerPatterns: ['SAN*', 'SAN值*', '*理智*', '*sanity*', '*Sanity*'],
        allowedTargets: ['SAN', 'SAN值', '理智', 'Sanity', 'san'],
      },
      // CoC7 孤注一掷：失败时可重掷一次，大失败/SAN检定/闪避等不可
      pushedRoll: {
        enabled: true,
        pushableOutcomes: ['warning', 'failure'], // 仅失败/未达标可push
        blockedOutcomes: ['crit_failure'], // 大失败不可push
        excludePatterns: ['SAN*', 'SAN值*', '*理智*', '*sanity*', '*Sanity*', '*闪避*', '*dodge*', '*Dodge*'],
        outcomeLabels: {
          crit_success: '🎲 孤注一掷 — 大成功！',
          extreme_success: '🎲 孤注一掷 — 极难成功！',
          success: '🎲 孤注一掷成功！',
          '*': '⚠ 孤注一掷失败！',
        },
      },
      // CoC7 燃运：消耗幸运降低骰子结果
      // 根据规则：几乎所有检定可燃运，但 SAN检定、幸运检定、伤害骰、孤注一掷不可
      resourceBurners: [
        {
          id: 'coc7_luck_burn',
          resourceName: '幸运',
          target: 'roll',
          ratio: 1, // 1点幸运 = 1点骰子结果
          direction: 'decrease', // 降低骰子结果（CoC 低好）
          suggestedAmount: '$roll.total - $attr', // 刚好让投骰结果 <= 属性值
          condition: '$roll.total > $attr && $isPushed == 0', // 仅在失败时显示，孤注一掷时不可燃运
          selector: {
            namePatterns: {
              include: ['*'], // 适用于所有属性名
              exclude: [
                'SAN*',
                'SAN值*',
                '*理智*',
                '*sanity*',
                '*Sanity*', // SAN 检定不可燃运
                '幸运*',
                '*Luck*',
                '*luck*', // 幸运检定不可燃运
              ],
            },
          },
          ui: {
            icon: 'fa-clover',
            color: 'var(--acu-accent)',
            tooltip: '消耗幸运降低骰子结果 (1:1)',
          },
        },
      ],
      quickActions: [
        {
          id: 'to_san_check',
          kind: 'attr_shortcut',
          icon: 'fa-brain',
          tooltip: 'SAN检定',
          config: {
            presetId: 'coc7_check',
            carryInitiator: true,
            carryAttrValue: false,
            carryTarget: false,
            carryModifier: false,
            carrySkillMod: false,
            attrAliasCandidates: ['SAN值', 'SAN', '理智', 'sanity', 'Sanity', 'san'],
            fallbackAttrName: 'SAN值',
          },
        },
        {
          id: 'to_skill_growth',
          kind: 'workflow_shortcut',
          icon: 'fa-seedling',
          tooltip: '技能成长检定',
          config: {
            presetId: 'coc7_growth_check',
            carryInitiator: true,
            carryAttrName: true,
            carryAttrValue: true,
          },
        },
      ],
      outcomes: [
        {
          id: 'crit_success',
          name: '大成功',
          condition: '$roll.total === 1',
          priority: 1,
          rank: 4,
          contestRank: 100, // 对抗等级
          outputText: '',
        },
        {
          id: 'extreme_success',
          name: '极难成功',
          condition: '$roll.total <= $attr / 5',
          priority: 10,
          rank: 3,
          contestRank: 100, // 对抗等级
          outputText: '',
        },
        {
          id: 'hard_success',
          name: '困难成功',
          condition: '$roll.total <= $attr / 2',
          priority: 20,
          rank: 2,
          contestRank: 80, // 对抗等级
          outputText: '',
        },
        {
          id: 'success',
          name: '成功',
          condition: '$roll.total <= $attr',
          priority: 30,
          rank: 1,
          contestRank: 60, // 对抗等级
          outputText: '',
          effects: [
            {
              id: 'san_loss_success',
              target: 'SAN',
              operation: 'subtract',
              value: '1',
              outputText: 'SAN 减少 $effectDelta (成功)',
            },
          ],
        },
        {
          id: 'failure',
          name: '失败',
          condition: '$roll.total > $attr',
          displayExpr: '$roll.total <= $attr', // 显示成功条件，失败时显示"不成立"
          priority: 50,
          rank: 0,
          contestRank: 40, // 对抗等级
          outputText: '',
          effects: [
            {
              id: 'san_loss_fail',
              target: 'SAN',
              operation: 'subtract',
              value: '1d6',
              outputText: 'SAN 减少 $effectDelta',
            },
          ],
        },
        {
          id: 'crit_failure',
          name: '大失败',
          condition: '($attr < 50 && $roll.total >= 96) || ($attr >= 50 && $roll.total === 100)',
          priority: 5,
          rank: -1,
          contestRank: 20, // 对抗等级
          outputText: '',
          effects: [
            {
              id: 'san_loss_fumble',
              target: 'SAN',
              operation: 'subtract',
              value: '1d10',
              outputText: 'SAN 减少 $effectDelta (大失败)',
            },
          ],
        },
        {
          id: 'unmet',
          name: '失败',
          condition: 'false',
          priority: 999,
          rank: -2,
        },
      ],
      outcomePolicy: {
        kind: 'minRank',
        requiredRankVarId: 'requiredRank',
        unmetOutcomeId: 'unmet',
        keepActualOutcome: true,
      },
      // CoC7 SAN疯狂判定：基于SAN损失量和SAN阈值触发
      secondaryEffects: [
        {
          id: 'coc7_temp_insanity',
          trigger: { type: 'delta', attribute: 'SAN', operator: 'gte', value: '5' },
          outputText: '⚠ 单次SAN损失$delta点(≥5)，触发临时疯狂流程，自动进行INT检定。',
          subCheck: {
            label: 'INT检定',
            attribute: 'INT',
            attributeCandidates: ['智力', '灵感', '灵感值'],
            dice: '1d100',
            operator: 'lte',
            success: {
              outputText:
                '🧠 $subCheckLabel：$subCheckDice=$subCheckRoll，判定 $subCheckRoll <= $subCheckTarget？$subCheckJudge，$initiator 陷入临时疯狂。\n症状：$symptomResult\n持续时间：即时发作约$durationImmediateRoll轮，整体影响约$durationSummaryRoll小时。',
              randomTables: {
                durationImmediate: { dice: '1d10' },
                durationSummary: { dice: '1d10' },
                symptom: {
                  dice: '1d10',
                  entries: {
                    1: '失忆——$initiator 回过神来，发现自己身处陌生之处，不记得这段时间发生了什么',
                    2: '假性残疾——$initiator 陷入心因性失明、失聪或肢体瘫痪',
                    3: '暴力倾向——$initiator 陷入暴怒，不分敌我地攻击周围一切',
                    4: '偏执——$initiator 产生严重的被害妄想，不信任任何人',
                    5: '重要之人——$initiator 把在场某人当作了自己生命中的重要之人',
                    6: '昏厥——$initiator 当场昏倒，不省人事',
                    7: '惊慌逃跑——$initiator 不顾一切地逃离此地',
                    8: '歇斯底里——$initiator 情绪彻底崩溃，无法控制地大笑、大哭或尖叫',
                    9: '恐惧症——$initiator 获得一个新的恐惧症（由KP根据场景决定具体内容）',
                    10: '狂躁症——$initiator 获得一个新的狂躁症（由KP根据场景决定具体内容）',
                  },
                },
              },
            },
            failure: {
              outputText:
                '🧠 $subCheckLabel：$subCheckDice=$subCheckRoll，判定 $subCheckRoll <= $subCheckTarget？$subCheckJudge，$initiator 未陷入临时疯狂。',
            },
          },
          enabled: true,
          maxTriggerCount: 1,
        },
        {
          id: 'coc7_permanent_insanity',
          trigger: { type: 'threshold', attribute: 'SAN', operator: 'lte', value: '0' },
          outputText: '💀 永久疯狂！SAN值降至$new，该角色永久疯狂，由KP接管成为NPC。',
          enabled: true,
          maxTriggerCount: 1,
        },
      ],
      contestRule: {
        mode: 'rank', // 对抗模式：按成功等级
        tieBreakers: ['higher_attr', 'initiator_wins'], // 平局处理：先比属性，再判发起方胜
      },
      outputTemplate:
        '<meta:检定结果>\n$outcomeText\n元叙事：$initiator 发起了 $attrName 检定，$formula=$roll，判定 $conditionExpr？$judgeResult，判定为【$outcomeName】\n</meta:检定结果>',
    },
    {
      kind: 'advanced',
      id: 'coc7_growth_check',
      name: 'CoC7-成长',
      description: '幕间技能成长快捷模式（检定成功可成长）',
      version: PRESET_FORMAT_VERSION,
      builtin: true,
      visible: false,
      checkSuggestionGuide: COC7_GROWTH_CHECK_SUGGESTION_GUIDE,
      checkSuggestionAliases: {
        params: {
          成长: 'growthGain',
          成长值: 'growthGain',
        },
      },
      diceExpression: '1d100',
      attribute: {
        label: '技能值',
        placeholder: '留空=50',
        defaultValue: 50,
        key: '技能值',
      },
      dc: {
        hidden: true,
        defaultValue: 0,
      },
      mod: {
        hidden: true,
        defaultValue: 0,
      },
      customFields: [
        {
          id: 'growthGain',
          type: 'text',
          label: '成长值',
          defaultValue: '1d10',
          placeholder: '如 1d10',
        },
      ],
      outcomes: [
        {
          id: 'growth_success',
          name: '成功',
          condition: '$roll.total > $attr',
          priority: 30,
          rank: 1,
          outputText: '',
        },
        {
          id: 'growth_failure',
          name: '失败',
          condition: '$roll.total <= $attr',
          displayExpr: '$roll.total > $attr',
          priority: 60,
          rank: 0,
          outputText: '',
        },
      ],
      currentAttrAutoUpdate: {
        enabled: true,
        when: 'success',
        operation: 'add',
        valueExpr: '$growthGain',
        min: 0,
        changeLabel: '成长',
        outputTextTemplate: '已填表：$attr成长$expr=$rolled，$attrPlain从$old变为$new',
      },
      outputTemplate:
        '<meta:检定结果>\n元叙事：$initiator 发起了$attrName成长检定，$formula=$roll，判定 $conditionExpr？$judgeResult，结果为【$outcomeName】\n</meta:检定结果>',
    },
    // DND5e 规则: 1d20 + 调整值 >= DC (调整值 = floor((属性值-10)/2))
    {
      kind: 'advanced',
      id: 'dnd5e_check',
      name: 'DND5e',
      description: 'D&D第五版: 1d20 + 调整值 >= DC (调整值自动从属性值计算)',
      version: PRESET_FORMAT_VERSION,
      builtin: true,
      checkSuggestionGuide: DND5E_CHECK_SUGGESTION_GUIDE,
      checkSuggestionAliases: DND5E_CHECK_SUGGESTION_ALIASES,
      diceExpression: '1d20',
      attribute: {
        label: '属性值',
        placeholder: '留空=10',
        defaultValue: 10,
        key: '属性值',
        // DND特有：从属性值计算调整值
        computeModifier: 'floor(($attr - 10) / 2)',
      },
      dc: {
        label: '难度等级(DC)',
        placeholder: '留空=10',
        defaultValue: 10,
      },
      mod: {
        label: '额外加值',
        placeholder: '留空=0',
        defaultValue: 0,
      },
      // 技能加值（DND5e 技能检定使用）
      skillMod: {
        label: '技能加值',
        placeholder: '留空=0',
        defaultValue: 0,
      },
      // 属性填入目标映射：技能类属性填入 skillMod，基础属性填入 attribute
      attrTargetMapping: {
        skillMod: [
          // DND5e 18个技能
          '运动', // 力量
          '体操',
          '巧手',
          '隐匿', // 敏捷
          '奥秘',
          '历史',
          '调查',
          '自然',
          '宗教', // 智力
          '驯兽',
          '洞悉',
          '医药',
          '察觉',
          '求生', // 感知
          '欺瞒',
          '威吓',
          '表演',
          '游说', // 魅力
        ],
      },
      customFields: [
        {
          id: 'advantage',
          type: 'select',
          label: '优势/劣势',
          defaultValue: 0,
          options: [
            { label: '正常', value: 0 },
            { label: '优势', value: 1 },
            { label: '劣势', value: -1 },
          ],
        },
      ],
      dicePatches: [
        { when: '$advantage > 0', op: 'replace', template: '2d20kh1' }, // 优势
        { when: '$advantage < 0', op: 'replace', template: '2d20kl1' }, // 劣势
      ],
      outcomes: [
        {
          id: 'crit_success',
          name: '大成功',
          condition: "$roll.hasTag('nat20')",
          priority: 1,
          outputText: '',
        },
        {
          id: 'success',
          name: '成功',
          // $attrMod 是从属性值计算的调整值，$skillMod 是技能加值
          condition: '$roll.total + $attrMod + $skillMod + $mod >= $dc',
          priority: 30,
          outputText: '',
        },
        {
          id: 'failure',
          name: '失败',
          condition: 'true',
          displayExpr: '$roll.total + $attrMod + $skillMod + $mod >= $dc', // 显示成功条件，失败时显示"不成立"
          priority: 50,
          outputText: '',
        },
        {
          id: 'crit_failure',
          name: '大失败',
          condition: "$roll.hasTag('nat1')",
          priority: 2,
          outputText: '',
        },
      ],
      contestRule: {
        mode: 'value', // 对抗模式：按总值比较
        tieBreakers: ['status_quo'], // 平局维持现状
        hideDc: true, // 对抗检定时隐藏DC（双方直接比较总值，不需要固定难度）
        // hideMod: false - 对抗检定时显示额外加值字段
      },
      // DND对抗检定专用模板：双方总值直接比较，不使用固定DC
      contestOutputTemplate: `<meta:检定结果>
元叙事：进行了一次【$initiator $initAttrName vs $opponent $oppAttrName】的对抗检定。
$initiator $initAttrName：$initCheckValueText$initModText，$initFormula=$initRoll，总值=$initTotal；
$opponent $oppAttrName：$oppCheckValueText$oppModText，$oppFormula=$oppRoll，总值=$oppTotal。
最终结果：【$winner】
</meta:检定结果>`,
      outputTemplate:
        '<meta:检定结果>\n$outcomeText\n元叙事：$initiator 发起了 $attrName 检定，$checkValueText$modText，$formula=$roll，判定 $conditionExpr？$judgeResult，判定为【$outcomeName】\n</meta:检定结果>',
    },
    {
      kind: 'advanced',
      id: 'fate',
      name: 'Fate',
      description: 'Fate规则: 4dF + 技能值 + 修正值 >= 难度',
      version: PRESET_FORMAT_VERSION,
      builtin: true,
      checkSuggestionGuide: FATE_CHECK_SUGGESTION_GUIDE,
      checkSuggestionAliases: {
        params: {
          难度: 'dc',
          修正: 'mod',
          修正值: 'mod',
        },
      },
      diceExpression: '4dF',
      attributeName: {
        label: '技能/风格',
        placeholder: '自由检定',
      },
      attribute: {
        label: '技能值',
        placeholder: '留空=0',
        defaultValue: 0,
        key: '技能值',
      },
      dc: {
        label: '难度',
        placeholder: '留空=0',
        defaultValue: 0,
      },
      mod: {
        label: '修正值',
        placeholder: '留空=0',
        defaultValue: 0,
      },
      outcomes: [
        {
          id: 'succeed_with_style',
          name: '大成功',
          condition: '$roll.total + $attr + $mod >= $dc + 3',
          priority: 1,
          outputText: 'Fate: 大成功！超出难度3级或更多，可获得额外好处。',
        },
        {
          id: 'success',
          name: '成功',
          condition: '$roll.total + $attr + $mod >= $dc',
          priority: 10,
          outputText: 'Fate: 成功，达成目标。',
        },
        {
          id: 'tie',
          name: '平手',
          condition: '$roll.total + $attr + $mod === $dc - 1',
          priority: 20,
          outputText: 'Fate: 平手，勉强达成但可能有小代价。',
        },
        {
          id: 'failure',
          name: '失败',
          condition: '$roll.total + $attr + $mod < $dc',
          priority: 99,
          outputText: 'Fate: 失败，未能达成目标。',
        },
      ],
      contestRule: {
        mode: 'margin', // 对抗模式：按总值差值裁决
        hideDc: true, // 对抗检定时隐藏难度字段（双方直接比较）
      },
      outputTemplate:
        '<meta:检定结果>\n$outcomeText\n元叙事：$initiator 发起了 $attrName 检定，技能等级$attrValue，修正值$mod，$formula=$roll，总值=$roll+$attr+$mod，判定 $conditionExpr？$judgeResult，判定为【$outcomeName】\n</meta:检定结果>',
      contestOutputTemplate: `<meta:检定结果>
 元叙事：进行了一次【$initiator $initAttrName vs $opponent $oppAttrName】的Fate对抗检定。
 $initiator $initAttrName：$initFormula=$initRoll，技能等级$initAttr+修正值$initMod，总值=$initTotal；
 $opponent $oppAttrName：$oppFormula=$oppRoll，技能等级$oppAttr+修正值$oppMod，总值=$oppTotal。
 差值(Shifts)：$margin（正数表示$initiator领先，负数表示$opponent领先）
 最终结果：【$winner】
 </meta:检定结果>`,
    },
    // PbtA 规则: 2d6 + 属性值, 6-失败/7-9部分成功/10+完全成功
    {
      kind: 'advanced',
      id: 'pbta_move',
      name: 'PbtA',
      description: 'Powered by the Apocalypse: 2d6+属性, 6-失败/7-9部分成功/10+完全成功',
      version: PRESET_FORMAT_VERSION,
      builtin: true,
      checkSuggestionGuide: PBTA_CHECK_SUGGESTION_GUIDE,
      checkSuggestionAliases: {
        params: {
          修正: 'mod',
          临时加值: 'mod',
        },
      },
      diceExpression: '2d6',
      attribute: {
        label: '属性值',
        placeholder: '留空=0',
        defaultValue: 0,
        key: '属性',
      },
      dc: {
        hidden: true,
        defaultValue: 0,
      },
      mod: {
        label: '临时加值',
        placeholder: '留空=0',
        defaultValue: 0,
      },
      outcomes: [
        {
          id: 'strong_hit',
          name: '完全成功',
          condition: '$roll.total + $attr + $mod >= 10',
          priority: 1,
          outputText: 'PbtA:完全成功!',
        },
        {
          id: 'weak_hit',
          name: '部分成功',
          condition: '$roll.total + $attr + $mod >= 7',
          priority: 20,
          outputText: 'PbtA:部分成功。',
        },
        {
          id: 'miss',
          name: '失败',
          condition: '$roll.total + $attr + $mod < 7',
          priority: 99,
          outputText: 'PbtA:失败...',
        },
      ],
      contestRule: {
        disabled: true, // PbtA 规则不支持传统对抗检定
      },
      outputTemplate:
        '<meta:检定结果>\n$outcomeText\n元叙事：$initiator 发起了 $attrName 检定，属性值$attrValue，临时加值$mod，$formula=$roll，总值=$roll+$attr+$mod，判定 $conditionExpr？$judgeResult，判定为【$outcomeName】\n</meta:检定结果>',
    },
    // 三角机构规则: 6d4统计3的个数
    {
      kind: 'advanced',
      id: 'triangle_agency',
      name: '三角机构',
      description: '6d4统计3的个数；至少一个3成功，三个3为三重升华；无3失败',
      version: PRESET_FORMAT_VERSION,
      builtin: true,
      checkSuggestionGuide: TRIANGLE_AGENCY_CHECK_SUGGESTION_GUIDE,
      diceExpression: '6d4=3',
      attribute: {
        hidden: true,
        defaultValue: 0,
      },
      dc: {
        hidden: true,
        defaultValue: 0,
      },
      mod: {
        hidden: true,
        defaultValue: 0,
      },
      derivedVars: [{ id: 'chaos', expr: '6 - $roll.total' }],
      outcomes: [
        {
          id: 'triple_success',
          name: '三重升华',
          condition: '$roll.total === 3',
          priority: 1,
          rank: 3,
          outputText: '三角机构：三重升华！命中三个3，完美共鸣达成。',
        },
        {
          id: 'success',
          name: '成功',
          condition: '$roll.total >= 1',
          priority: 10,
          rank: 1,
          outputText: '三角机构：成功。至少命中一个3，行动达成。',
        },
        {
          id: 'failure',
          name: '失败',
          condition: '$roll.total === 0',
          priority: 50,
          rank: 0,
          outputText: '三角机构：失败。未能命中任何3，行动受阻。',
        },
      ],
      contestRule: {
        disabled: true, // 三角机构不支持对抗检定
      },
      outputTemplate:
        '<meta:检定结果>\n$outcomeText\n元叙事：$initiator 的三角机构检定，$formula=$roll，命中3的个数：$roll.total，GM获得混沌：$chaos，判定为【$outcomeName】\n</meta:检定结果>',
    },
  ];
