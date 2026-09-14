// @ts-nocheck
/**
 * build-new-advanced-preset-jsonc-template.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createBuildNewAdvancedPresetJsoncTemplate(deps: any) {
  const buildNewAdvancedPresetJsoncTemplate = (): string => `{
  // 这是一个可直接使用的 CoC7 风格高级检定预设示例。
  // 预设名称和描述可以在上方输入框填写；如果这里也写 name / description，保存时会以最终解析结果为准。
  // diceExpression / customFields / outcomes / outcomePolicy 决定实际投骰与判定。
  // checkSuggestionGuide 决定“检定建议表”里 <检定规则> 展示给 AI 的提示词；删除其中任意段时会自动生成缺失段。
  // checkSuggestionAliases 决定 DSL 参数名和值的中文别名，只处理 key=value 参数，不处理角色名或属性名别名。
  "kind": "advanced",
  "name": "自定义检定预设",
  "description": "1d100 小于等于属性值成功，支持最低成功等级与奖惩骰",

  // diceExpression：基础投骰公式。dicePatches 可以在它后面追加 b/p 奖惩骰。
  "diceExpression": "1d100",

  // attribute：普通检定的主输入字段；这里表示技能值，不填时默认 50。
  "attribute": {
    "label": "技能值",
    "placeholder": "留空=50",
    "defaultValue": 50,
    "key": "技能值"
  },

  // dc / mod / skillMod 是内置字段；不使用时隐藏并给出默认值，避免表达式里出现空值。
  "dc": {
    "hidden": true,
    "defaultValue": 0
  },
  "mod": {
    "hidden": true,
    "defaultValue": 0
  },

  // customFields：规则专属输入。select 适合固定选项，number 适合奖惩骰、难度值等数字。
  "customFields": [
    {
      "id": "bonusPenalty",
      "type": "number",
      "label": "奖惩骰",
      "defaultValue": "",
      "placeholder": "+1 奖励，-1 惩罚"
    },
    {
      "id": "requiredRank",
      "type": "select",
      "label": "最低成功等级",
      "defaultValue": 1,
      "options": [
        { "label": "成功", "value": 1 },
        { "label": "困难成功", "value": 2 },
        { "label": "极难成功", "value": 3 }
      ],
      "contestOverride": { "hidden": true }
    }
  ],

  // derivedVars：中间变量，适合复用复杂公式；下面把奖惩骰绝对值提取为 $absBp。
  "derivedVars": [
    { "id": "absBp", "expr": "abs($bonusPenalty)" }
  ],

  // dicePatches：按条件修改投骰公式。append 会把 template 追加到 diceExpression 后。
  "dicePatches": [
    { "when": "$bonusPenalty > 0", "op": "append", "template": "b$absBp" },
    { "when": "$bonusPenalty < 0", "op": "append", "template": "p$absBp" }
  ],

  // outcomes：判定分支。condition 先匹配 priority 更小的项；兜底分支可用较大 priority。
  "outcomes": [
    { "id": "crit_success", "name": "大成功", "condition": "$roll.total === 1", "priority": 1, "rank": 4, "contestRank": 100 },
    { "id": "extreme_success", "name": "极难成功", "condition": "$roll.total <= $attr / 5", "priority": 10, "rank": 3, "contestRank": 100 },
    { "id": "hard_success", "name": "困难成功", "condition": "$roll.total <= $attr / 2", "priority": 20, "rank": 2, "contestRank": 80 },
    { "id": "success", "name": "成功", "condition": "$roll.total <= $attr", "priority": 30, "rank": 1, "contestRank": 60 },
    { "id": "failure", "name": "失败", "condition": "$roll.total > $attr", "displayExpr": "$roll.total <= $attr", "priority": 50, "rank": 0, "contestRank": 40 },
    { "id": "crit_failure", "name": "大失败", "condition": "($attr < 50 && $roll.total >= 96) || ($attr >= 50 && $roll.total === 100)", "priority": 5, "rank": -1, "contestRank": 20 },
    { "id": "unmet", "name": "失败", "condition": "false", "priority": 999, "rank": -2 }
  ],

  // outcomePolicy：命中 outcome 后再做二次裁决；这里用于“最低成功等级”。
  "outcomePolicy": {
    "kind": "minRank",
    "requiredRankVarId": "requiredRank",
    "unmetOutcomeId": "unmet",
    "keepActualOutcome": true
  },

  // contestRule：对抗检定规则；mode=rank 时先比较成功等级，再按 tieBreakers 破平。
  "contestRule": {
    "mode": "rank",
    "tieBreakers": ["higher_attr", "initiator_wins"]
  },

  // outputTemplate / contestOutputTemplate 必须保留 <meta:检定结果> 包裹，方便隐藏投骰结果和后续解析。
  "outputTemplate": "<meta:检定结果>\\n$outcomeText\\n元叙事：$initiator 发起了 $attrName 检定，$formula=$roll，判定 $conditionExpr？$judgeResult，判定为【$outcomeName】\\n</meta:检定结果>",
  "contestOutputTemplate": "<meta:检定结果>\\n元叙事：进行了一次【$initiator $initAttrName vs $opponent $oppAttrName】的对抗检定。\\n$initiator $initAttrName：$initFormula=$initRoll，判定 $initConditionExpr？$initJudgeResult，判定为【$initSuccessName】；\\n$opponent $oppAttrName：$oppFormula=$oppRoll，判定 $oppConditionExpr？$oppJudgeResult，判定为【$oppSuccessName】。\\n最终结果：【$winner】\\n</meta:检定结果>",

  // checkSuggestionGuide：同步到表格模板 <检定规则>，让 AI 知道如何生成“检定/对抗”命令。
  "checkSuggestionGuide": {
    "rule": "使用 CoC7 的 1d100 检定：掷 1d100，结果小于等于属性值则成功。需要更高门槛时，可写 难度=困难 或 难度=极难。",
    "dsl": "普通检定：检定 <角色> <属性> [难度=普通|困难|极难] [奖惩=奖励1|惩罚1]\\n对抗检定：对抗 <发起者> <属性> vs <对手> <属性> [难度=普通|困难|极难] [奖惩=奖励1|惩罚1]\\n固定成功：必成\\n固定失败：必败\\n无需检定：无",
    "examples": "1. 展示文本：<user>在昏暗走廊里寻找血迹。\\n   骰子命令：检定 <user> 侦查 难度=困难\\n2. 展示文本：<user>盯紧<角色>的眼睛，尝试判断她是否隐瞒了真相。\\n   骰子命令：对抗 <user> 心理学 vs <角色> 话术"
  },

  // checkSuggestionAliases：把中文 DSL 参数和值映射到 customFields / 内部变量。
  "checkSuggestionAliases": {
    "params": {
      "难度": "requiredRank",
      "最低成功等级": "requiredRank",
      "奖惩": "bonusPenalty",
      "奖惩骰": "bonusPenalty"
    },
    "values": {
      "requiredRank": {
        "普通": 1,
        "成功": 1,
        "普通成功": 1,
        "困难": 2,
        "困难成功": 2,
        "极难": 3,
        "极难成功": 3
      },
      "bonusPenalty": {
        "奖励1": 1,
        "奖励骰1": 1,
        "惩罚1": -1,
        "惩罚骰1": -1
      }
    }
  }
}`;
  return buildNewAdvancedPresetJsoncTemplate;
}
