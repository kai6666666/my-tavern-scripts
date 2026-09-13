// @ts-nocheck
/**
 * builtin-check-suggestion-guides.ts
 * Feature-Sliced 模块（数据常量）。
 */

export const COC7_CHECK_SUGGESTION_ALIASES: CheckSuggestionAliases = {
    params: {
      难度: 'requiredRank',
      最低成功等级: 'requiredRank',
      成功等级: 'requiredRank',
      奖惩: 'bonusPenalty',
      奖惩骰: 'bonusPenalty',
    },
    values: {
      requiredRank: {
        普通: 1,
        成功: 1,
        普通成功: 1,
        困难: 2,
        困难成功: 2,
        极难: 3,
        极难成功: 3,
      },
      bonusPenalty: {
        奖励: 1,
        奖励1: 1,
        奖励骰: 1,
        奖励骰1: 1,
        惩罚: -1,
        惩罚1: -1,
        惩罚骰: -1,
        惩罚骰1: -1,
      },
    },
  };

export const COC7_CHECK_SUGGESTION_GUIDE: CheckSuggestionGuide = {
    rule:
      '使用 CoC7 的 1d100 检定：掷 1d100，结果小于等于属性值则成功。普通检定与对抗检定都必须使用下方角色属性清单里的普通属性或特殊属性。\n' +
      'CoC7 成功等级：大成功 > 极难成功 > 困难成功 > 普通成功 > 失败 > 大失败。完成目标难度较高时，可写 难度=困难 或 难度=极难；正常难度则不要写该参数。\n' +
      '当角色明显处于优势或劣势地位时可以指定奖惩骰。格式为 奖惩=奖励1 或 奖惩=惩罚1；没有明确奖惩时不要写该参数。',
    dsl:
      '普通检定：检定 <角色> <属性> [难度=普通|困难|极难] [奖惩=奖励1|惩罚1]\n' +
      '对抗检定：对抗 <发起者> <属性> vs <对手> <属性> [难度=普通|困难|极难] [奖惩=奖励1|惩罚1]\n' +
      '固定成功：必成\n固定失败：必败\n无需检定：无',
    examples:
      '以下示例用于说明 display_text 与 dice_command 的对应关系。生成时必须根据当前剧情、角色与属性重新编写，不得直接复用。\n' +
      '1. 展示文本：<user>俯身检查地毯边缘，尝试寻找可疑的痕迹。\n' +
      '   骰子命令：检定 <user> 侦查 难度=困难\n' +
      '2. 展示文本：守夜人表示昨夜没有听到任何奇怪的声音，<user>观察他的神情，判断他是否在说谎。\n' +
      '   骰子命令：对抗 <user> 心理学 vs 守夜人 话术\n' +
      '3. 展示文本：<user>在空旷的平地上一边逃跑一边躲避射击。\n' +
      '   骰子命令：检定 <user> 敏捷 奖惩=惩罚1\n' +
      '4. 展示文本：<角色A>利用能力封锁整个场馆。\n' +
      '   骰子命令：必成\n' +
      '5. 展示文本：<角色B>试图强行闯入完全封死的结界中。\n' +
      '   骰子命令：必败',
  };

export const COC7_GROWTH_CHECK_SUGGESTION_GUIDE: CheckSuggestionGuide = {
    rule: '使用 CoC7 幕间成长检定：掷 1d100，结果大于当前技能值时表示技能获得成长机会。该预设主要用于幕间或阶段结算，不适合作为普通行动成败判定。',
    dsl: '成长检定：检定 <角色> <技能> [成长值=1d10]\n' + '固定成功：必成\n固定失败：必败\n无需检定：无',
    examples:
      '1. 展示文本：<user>在幕间整理案件记录，检视侦查技能是否成长。\n' +
      '   骰子命令：检定 <user> 侦查 成长值=1d10\n' +
      '2. 展示文本：某个技能没有经历足够压力，不进行成长检定。\n' +
      '   骰子命令：无',
  };

export const DND5E_CHECK_SUGGESTION_ALIASES: CheckSuggestionAliases = {
    params: {
      属性: 'attr',
      属性值: 'attr',
      基础属性: 'attr',
      难度: 'dc',
      目标值: 'dc',
      技能: 'skillMod',
      技能加值: 'skillMod',
      修正: 'mod',
      额外加值: 'mod',
      优势: 'advantage',
      优劣势: 'advantage',
    },
    values: {
      advantage: {
        优势: 1,
        正常: 0,
        平常: 0,
        劣势: -1,
      },
    },
  };

export const DND5E_CHECK_SUGGESTION_GUIDE: CheckSuggestionGuide = {
    rule:
      '使用类 D&D 检定：掷 1d20，加上调整值，总值大于等于 DC 则成功。\n' +
      '默认只选择最贴合行动的基础属性或特有属性。只有当这次行动确实同时依赖基础素质和具体技能/能力时，命令里才同时写基础属性和特有属性。',
    dsl:
      '普通检定：检定 <角色> <属性或技能> dc=<目标值> [attr=<相关基础属性>] [mod=<额外加值>] [优势=优势|正常|劣势]\n' +
      '对抗检定：对抗 <发起者> <技能> vs <对手> <技能> [leftAttr=<发起者相关基础属性>] [rightAttr=<对手相关基础属性>] [优势=优势|正常|劣势] [leftAdvantage=优势|正常|劣势] [rightAdvantage=优势|正常|劣势]\n' +
      '固定成功：必成\n固定失败：必败\n无需检定：无',
    examples:
      '1. 展示文本：<user>拼尽全力尝试在崩塌前冲过断桥。\n' +
      '   骰子命令：检定 <user> 敏捷 dc=14\n' +
      '2. 展示文本：<角色A>发动空间移动，带着同伴脱离危险区域。\n' +
      '   骰子命令：检定 <角色A> 空间移动 dc=15\n' +
      '3. 展示文本：<角色A>贴着阴影移动，尝试躲过<角色B>的视线。\n' +
      '   骰子命令：对抗 <角色A> 隐匿 vs <角色B> 察觉 leftAttr=敏捷 rightAttr=感知\n' +
      '4. 展示文本：<角色A>借助地形优势压制<角色B>，而<角色B>视野受阻。\n' +
      '   骰子命令：对抗 <角色A> 运动 vs <角色B> 体操 leftAttr=力量 rightAttr=敏捷 leftAdvantage=优势 rightAdvantage=劣势\n' +
      '5. 展示文本：<user>试图用夸张的宫廷传闻吸引贵族的注意力。\n' +
      '   骰子命令：检定 <user> 游说 attr=魅力 dc=13\n' +
      '6. 展示文本：被封印的石门没有任何正面突破的希望，只能另寻道路。\n' +
      '   骰子命令：无',
  };

export const FATE_CHECK_SUGGESTION_GUIDE: CheckSuggestionGuide = {
    rule: '使用 Fate 检定：掷 4dF，加上技能值与修正值，总值达到难度则成功；超过难度 3 级或更多为大成功。',
    dsl:
      '普通检定：检定 <角色> <技能或风格> dc=<难度> [mod=<修正值>]\n' +
      '对抗检定：对抗 <发起者> <技能或风格> vs <对手> <技能或风格> [mod=<修正值>] [leftMod=<发起者修正>] [rightMod=<对手修正>]\n' +
      '固定成功：必成\n固定失败：必败\n无需检定：无',
    examples:
      '1. 展示文本：<user>以“谨慎”风格拆解嫌疑人的矛盾证词。\n' +
      '   骰子命令：检定 <user> 谨慎 dc=2\n' +
      '2. 展示文本：<角色A>与<角色B>在屋顶边缘展开追逐。\n' +
      '   骰子命令：对抗 <角色A> 迅捷 vs <角色B> 强壮',
  };

export const PBTA_CHECK_SUGGESTION_GUIDE: CheckSuggestionGuide = {
    rule: '使用 PbtA 行动检定：掷 2d6，加上属性值与临时加值；10+ 完全成功，7-9 部分成功，6- 失败。该预设不使用传统对抗检定。',
    dsl: '普通检定：检定 <角色> <属性或行动> [mod=<临时加值>]\n' + '固定成功：必成\n固定失败：必败\n无需检定：无',
    examples:
      '1. 展示文本：<user>在枪火中强行穿过废墟街口。\n' +
      '   骰子命令：检定 <user> 冷酷 mod=1\n' +
      '2. 展示文本：<角色>向风暴低语，寻找下一幕灾厄的征兆。\n' +
      '   骰子命令：检定 <角色> 怪异',
  };

export const TRIANGLE_AGENCY_CHECK_SUGGESTION_GUIDE: CheckSuggestionGuide = {
    rule:
      '使用三角机构检定：掷 6d4 并统计结果为 3 的骰子数量；至少一个 3 成功，三个 3 为三重升华，没有 3 则失败。该预设不使用传统对抗检定。\n' +
      '三角机构的检定通常有两类：一是向机构申请改变现实，二是发挥角色的异常能力。两者最终都应由 GM 选择一个合适的素质进行检定，可选的素质为[缜密、欺瞒、活力、共情、主动、坚持、气质、专业、低调。]',
    dsl: '普通检定：检定 <角色> <素质>\n' + '固定成功：必成\n固定失败：必败\n无需检定：无',
    examples:
      '1. 展示文本：<user>向机构申请改变现实：让施工大楼的安全隐患立刻被相关人员注意到，并封锁附近街道。\n' +
      '   骰子命令：检定 <user> 缜密\n' +
      '2. 展示文本：<角色A>看了一眼手表，说“我们还有时间”，发动异常能力「时计」延缓追兵的抵达。\n' +
      '   骰子命令：检定 <角色A> 专业',
  };
