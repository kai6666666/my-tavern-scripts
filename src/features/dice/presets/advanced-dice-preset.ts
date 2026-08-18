// @ts-nocheck
// 来源：src/features/dice/index.ts 章节 idx=22「高级骰子预设系统」
// 原行范围：12389-13798（含 banner 12384-13798）；拆分批次 5；外部 closure 依赖：1（PRESET_FORMAT_VERSION@3）
// 接线说明：PRESET_FORMAT_VERSION 已随批次 5 拆至 engine/preset-constants.ts（0 依赖叶子模块），直接 import；
//   顶层 BUILTIN_ADVANCED_PRESETS 数组在模块求值时即读取真实值，不受接线时序影响。

import { PRESET_FORMAT_VERSION } from '../engine/preset-constants';
  // ========================================
  // 高级骰子预设系统
  // ========================================

  /** 多级结果定义 */
  interface OutcomeLevel {
    id: string; // 唯一标识
    name: string; // 显示名称 (如 "大成功")
    condition: string; // 判定表达式 (使用 evaluateCondition 评估)
    priority: number; // 优先级 (数字越小越优先)
    contestRank?: number; // 对抗等级 (可选)
    outputText?: string; // 输出文本模板 (可选)
    displayExpr?: string; // 显示用的算式表达式 (可选,不填则用 condition)
    style?: {
      color?: string;
    };
    /** 触发的效果列表 */
    effects?: Effect[];
  }

  /** 对抗规则配置 */
  interface ContestRule {
    /** 是否禁用对抗检定（如 PbtA 等规则不支持对抗检定） */
    disabled?: boolean;
    mode?: 'rank' | 'value' | 'margin' | 'custom'; // 对抗模式
    tieBreakers?: string[]; // 链式平局处理规则
    tieBreaker?: string; // 旧版单一平局处理(兼容)
    customExpr?: string; // 自定义表达式 (mode='custom' 时使用)
    hideDc?: boolean; // 对抗检定时隐藏DC字段
    hideMod?: boolean; // 对抗检定时隐藏修正值字段
    hideSkillMod?: boolean; // 对抗检定时隐藏技能加值字段
  }

  /** 后果系统：效果定义 */
  interface Effect {
    /** 唯一标识 */
    id: string;
    /** 目标属性名 */
    target: string;
    /** 操作类型 */
    operation: 'add' | 'subtract' | 'set';
    /** 变更值 (支持骰子表达式) */
    value: string;
    /** 执行条件表达式 (可选) */
    condition?: string;
    /** 属性不存在时的初始值 (可选) */
    initValue?: number;
    /** 最小值限制 (可选) */
    min?: number;
    /** 最大值限制 (可选) */
    max?: number;
    /** 自定义输出文本 (可选) */
    outputText?: string;
    /** 是否需要用户确认后才执行，默认 true (可选) */
    needsConfirm?: boolean;
    /** 确认输入框的标签文本，如 "成功时扣除" (可选) */
    label?: string;
    /** 确认输入框的占位符文本 (可选) */
    inputPlaceholder?: string;
  }

  /** 后果系统：全局配置 */
  interface EffectsConfig {
    /** 触发模式 (用于识别哪些检定可能触发效果) */
    triggerPatterns: string[];
    /** 允许修改的目标属性 */
    allowedTargets: string[];
    /** 按结果等级分组的效果列表 (可选) */
    outcomes?: {
      [outcomeName: string]: Effect[];
    };
    /** 各结果等级的默认值 (可选) */
    defaultValues?: {
      [outcomeName: string]: string;
    };
  }

  /** 后果系统：资源消耗 (Lucky Burner 等) */
  interface ResourceBurner {
    /** 唯一标识 */
    id: string;
    /** 资源属性名 */
    resourceName: string;
    /** 显示/可用条件 (表达式，如 "$roll > $attr" 仅失败时显示) */
    condition?: string;
    /** 影响目标: roll=修改投骰结果, mod=修改修正值, dc=修改难度, attribute=修改属性值 */
    target: 'roll' | 'mod' | 'dc' | 'attribute';
    /** 转换比例 (如 1点资源 = 1点投骰结果) */
    ratio: number;
    /** 影响方向 (increase=增加目标值, decrease=减少目标值) */
    direction: 'increase' | 'decrease';
    /** 资源操作方向: subtract=消耗/减少资源(默认), add=增加/累积资源 */
    resourceOperation?: 'subtract' | 'add';
    /** 建议消耗量表达式 (如 "$roll.total - $attr"，计算"刚好通过"需消耗的资源量) */
    suggestedAmount?: string;
    /** 适用范围选择器 (用于过滤哪些检定可以使用此消耗器) */
    selector?: CheckSelector;
    /** UI 显示配置 */
    ui?: {
      icon?: string;
      color?: string;
      tooltip?: string;
    };
  }

  interface QuickActionBase {
    /** 唯一标识 */
    id: string;
    /** 图标 (fa- 前缀) */
    icon?: string;
    /** 按钮提示 */
    tooltip?: string;
    /** 显示条件（基于当前面板上下文） */
    condition?: string;
  }

  interface WorkflowQuickAction extends QuickActionBase {
    kind: 'workflow_shortcut';
    config: {
      /** 目标预设ID */
      presetId: string;
      /** 切换时是否沿用当前输入 */
      carryInitiator?: boolean;
      carryAttrName?: boolean;
      carryAttrValue?: boolean;
      carryTarget?: boolean;
      carryModifier?: boolean;
      carrySkillMod?: boolean;
      /** 未沿用属性名时可指定默认属性名 */
      attrName?: string;
      /** 切换后自定义字段默认值 */
      customFieldValues?: Record<string, string | number | boolean>;
    };
  }

  interface AttrShortcutQuickAction extends QuickActionBase {
    kind: 'attr_shortcut';
    config: {
      /** 切换到目标预设（通常是常规检定预设） */
      presetId: string;
      /** 候选属性名（按顺序匹配角色现有属性） */
      attrAliasCandidates: string[];
      /** 未匹配到时的回退属性名 */
      fallbackAttrName?: string;
      /** 是否沿用当前发起者 */
      carryInitiator?: boolean;
      /** 是否沿用当前属性值 */
      carryAttrValue?: boolean;
      /** 是否沿用目标值 */
      carryTarget?: boolean;
      /** 是否沿用修正值 */
      carryModifier?: boolean;
      /** 是否沿用技能加值 */
      carrySkillMod?: boolean;
    };
  }

  type PresetQuickAction = WorkflowQuickAction | AttrShortcutQuickAction;

  interface CurrentAttrAutoUpdate {
    /** 是否启用 */
    enabled?: boolean;
    /** 触发时机 */
    when?: 'success' | 'failure' | 'always';
    /** 属性操作 */
    operation: 'add' | 'subtract' | 'set';
    /** 变化值表达式，支持变量 */
    valueExpr: string;
    /** 属性不存在时初始值 */
    initValue?: number;
    /** 最小值 */
    min?: number;
    /** 最大值 */
    max?: number;
    /** 属性别名候选 */
    aliasCandidates?: string[];
    /** 变化标签（如：成长/增加/减少） */
    changeLabel?: string;
    /** 已填表输出模板（可选）。可用变量：$attr, $attrPlain, $old, $new, $delta, $expr, $rolled, $operation, $changeLabel */
    outputTextTemplate?: string;
  }

  /** 检定范围选择器 (用于 Effects 和 ResourceBurner 的过滤) */
  interface CheckSelector {
    /** 属性名模式匹配 */
    namePatterns?: {
      /** 包含模式，默认 ['*'] 匹配所有 */
      include?: string[];
      /** 排除模式，优先于 include，默认 [] 无排除 */
      exclude?: string[];
    };
    /** 标签匹配 (用于非名称类例外，如 damage/pushed/luck) */
    tags?: {
      /** 包含标签 */
      include?: string[];
      /** 排除标签 */
      exclude?: string[];
    };
  }

  /** 后果系统：执行结果 */
  interface EffectResult {
    /** 效果 ID */
    effectId: string;
    /** 是否执行成功 */
    success: boolean;
    /** 变更前的值 */
    oldValue: number;
    /** 变更后的值 */
    newValue: number;
    /** 错误信息 */
    error?: string;
    /** 目标属性名 */
    target?: string;
    /** 效果链层级（1=一级效果） */
    level?: number;
    /** 触发来源（二级效果ID等） */
    triggerSourceId?: string;
    /** 触发阈值（若有） */
    triggerThreshold?: number;
    /** 触发类型（threshold/delta/primary） */
    triggerType?: 'threshold' | 'delta' | 'primary';
    /** 命中序号（all 模式下可用于追踪） */
    triggerMatchIndex?: number;
    /** 命中总数（all 模式下可用于追踪） */
    triggerMatchCount?: number;
    /** 信息输出文本（由 secondaryEffect.outputText 渲染，非数值变更） */
    outputMessage?: string;
    /** 执行来源分支标识（用于UI和提示词追踪） */
    branchLabel?: string;
    /** 计算公式文本（如 4d4 / 1d6 / 3） */
    formulaText?: string;
    /** 公式掷值（有掷骰时） */
    rolledValue?: number;
  }

  /**
   * 计算后的效果 (用于确认弹窗)
   */
  interface ComputedEffect {
    /** 关联效果ID */
    effectId: string;
    /** 目标属性名 */
    target: string;
    /** 解析后的目标属性名（若有） */
    resolvedTarget?: string;
    /** 计算后的变化值 */
    computedValue: number;
    /** 骰子或数字求值后的绝对值 */
    rolledValue: number;
    /** 原始公式 */
    formula: string;
    /** 展开文本,如 "1d6 → 3" */
    displayText: string;
    /** 执行前数值（若可读取） */
    beforeValue?: number | null;
    /** 执行后数值（若可预测） */
    afterValue?: number | null;
    /** 效果条件原始表达式（为空表示命中分支即执行） */
    conditionExpr?: string;
    /** 效果条件替换变量后的展示文本 */
    resolvedConditionExpr?: string;
    /** 效果条件是否成立 */
    conditionPassed?: boolean;
    /** 效果条件的自然语言说明 */
    conditionSummary?: string;
  }

  interface EffectConfirmUiConfig {
    /** 确认弹窗标题 */
    title?: string;
    /** 效果列表说明文本 */
    effectListTitle?: string;
    /** 分支说明标题 */
    branchReasonLabel?: string;
  }

  /**
   * 检定历史记录扩展字段
   * 用于在 AcuDice.CheckResult 基础上添加效果确认相关状态
   */
  interface CheckHistoryExtension {
    /** 效果执行状态 */
    effectStatus?: 'planned' | 'confirmed' | 'committed' | 'failed' | 'cancelled';
    /** 效果执行结果列表 */
    effectResults?: EffectResult[];
    /** 效果执行批次ID */
    effectRunId?: string;
    /** 效果执行错误 */
    effectError?: string;
    /** 效果执行追踪（按层级展开） */
    effectTrace?: string[];
    /** 运行事件序号（单调递增） */
    effectEventSeq?: number;
    /** 是否为孤注一掷（Pushed Roll） */
    isPushed?: boolean;
    /** 历史详情展开ID */
    detailId?: string;
    /** 历史详情行 */
    detailLines?: string[];
    /** 发起者名称 */
    initiatorName?: string;
    /** 检定显示类型 */
    historyType?: 'check' | 'contest';
  }

  interface EffectRunEventPayload {
    seq: number;
    runId: string;
    status: 'planned' | 'confirmed' | 'committed' | 'failed' | 'cancelled';
    characterName: string;
    attributeName: string;
    historyIndex: number;
    effectResults: EffectResult[];
    effectTrace: string[];
    chainMode?: 'first' | 'all';
    error?: string;
    timestamp: number;
  }

  interface EffectReplayOperation {
    characterName: string;
    target: string;
    operation: 'add' | 'subtract' | 'set';
    value: number;
    initValue?: number;
    min?: number;
    max?: number;
    aliasCandidates: string[];
    resultRef: EffectResult;
  }

  /**
   * 二级效果定义 (预留架构)
   * 用于定义基于属性变化触发的连锁效果
   */
  interface SecondaryEffect {
    /** 唯一标识 */
    id: string;
    /** 触发条件 */
    trigger: {
      /** 触发类型: threshold=基于阈值, delta=基于变化量 */
      type: 'threshold' | 'delta';
      /** 目标属性名 */
      attribute: string;
      /** 比较运算符 */
      operator: 'gt' | 'gte' | 'lt' | 'lte' | 'eq';
      /** 比较值，支持表达式如 "{意志}/5" */
      value: string;
    };
    /** 回调函数名或钩子标识 (可选) */
    callback?: string;
    /** 命中后要执行的后续效果（可选） */
    effects?: Effect[];
    /** 触发时输出的提示文本 (可选，支持变量: $delta, $old, $new, $attr, $depth, $tableRoll, $tableResult) */
    outputText?: string;
    /** 随机表: 触发时投骰并从表中查找结果，可通过 $tableRoll/$tableResult 在 outputText 中引用 */
    randomTable?: {
      /** 骰子表达式 (如 '1d10') */
      dice: string;
      /** 结果映射: key=投骰结果, value=对应文本 */
      entries: Record<number, string>;
    };
    /** 命名随机表：可一次投多个骰，变量名为 $<key>Roll / $<key>Result */
    randomTables?: Record<
      string,
      {
        /** 骰子表达式 (如 '1d10') */
        dice: string;
        /** 可选映射，不提供时 $<key>Result 默认等于点数 */
        entries?: Record<number, string>;
      }
    >;
    /** 子检定：用于自动化三级效果（例如 INT 检定） */
    subCheck?: {
      /** 显示标签 */
      label?: string;
      /** 目标属性名（主候选） */
      attribute: string;
      /** 目标属性名候选（用于别名/本地化） */
      attributeCandidates?: string[];
      /** 子检定骰子，默认 1d100 */
      dice?: string;
      /** 比较符，默认 lte（低于等于成功） */
      operator?: 'gt' | 'gte' | 'lt' | 'lte' | 'eq';
      /** 目标值表达式，默认使用读取到的属性值 */
      targetValue?: string;
      /** 属性缺失时提示文本（支持模板变量） */
      missingAttributeText?: string;
      /** 成功分支 */
      success?: {
        outputText?: string;
        randomTable?: {
          dice: string;
          entries: Record<number, string>;
        };
        randomTables?: Record<
          string,
          {
            dice: string;
            entries?: Record<number, string>;
          }
        >;
        effects?: Effect[];
      };
      /** 失败分支 */
      failure?: {
        outputText?: string;
        randomTable?: {
          dice: string;
          entries: Record<number, string>;
        };
        randomTables?: Record<
          string,
          {
            dice: string;
            entries?: Record<number, string>;
          }
        >;
        effects?: Effect[];
      };
    };
    /** 是否启用，默认 true */
    enabled?: boolean;
    /** 最大触发次数，默认 1 */
    maxTriggerCount?: number;
  }

  /** 表单字段配置 */
  interface FieldConfig {
    /** 输入框上方的标签文本 */
    label?: string;
    /** 输入框内的 placeholder 文本 */
    placeholder?: string;
    /** 留空时的默认值,支持数字或表达式字符串(必填) */
    defaultValue: number | string;
    /** 是否隐藏整个输入框区域 */
    hidden?: boolean;
  }

  interface CheckSuggestionGuide {
    /** 覆盖检定建议表中的【检定规则】段 */
    rule?: string;
    /** 覆盖检定建议表中的【DSL 命令】段 */
    dsl?: string;
    /** 覆盖检定建议表中的【格式示例】段 */
    examples?: string;
  }

  interface CheckSuggestionAliases {
    /** 中文参数名到预设字段 ID 的映射 */
    params?: Record<string, string>;
    /** 参数值别名映射，第一层 key 是归一化后的参数名 */
    values?: Record<string, Record<string, string | number | boolean>>;
  }

  interface AdvancedDicePreset {
    kind: 'advanced';
    id: string;
    name: string;
    description?: string;
    version: string;
    builtin: boolean;
    visible?: boolean;
    order?: number;
    createdAt?: string;

    // 骰子表达式
    diceExpression: string;

    // 属性/技能名称输入框（第一行右侧）
    attributeName?: FieldConfig;

    // 属性值来源（第二行）
    attribute: FieldConfig & {
      key?: string; // 属性名
      computeModifier?: string; // 从属性值派生调整值，如 floor(($attr - 10) / 2)
    };

    // DC来源
    dc: FieldConfig;

    // 修正值来源
    mod?: FieldConfig;

    // 技能加值（与 attribute/mod 平行，用于 DND5e 等规则）
    skillMod?: FieldConfig;

    /**
     * 属性填入目标映射
     * - key: 目标字段 ID ('attribute' | 'skillMod' | 'mod' | customField.id)
     * - value: 属性名数组（精确匹配）
     * - 未匹配的属性 fallback 到 'attribute'
     */
    attrTargetMapping?: Record<string, string[]>;

    // 自定义字段
    customFields?: CustomFieldConfig[];

    // 派生变量
    derivedVars?: DerivedVarSpec[];

    // 骰子表达式补丁
    dicePatches?: DiceExprPatch[];

    // 多级结果定义
    outcomes: OutcomeLevel[];

    // 对抗规则
    contestRule?: ContestRule;

    // 输出模板
    outputTemplate?: string;

    // 对抗检定专用输出模板（与 outputTemplate 独立）
    contestOutputTemplate?: string;

    // 判定结果检查策略
    outcomePolicy?: OutcomePolicy;

    /** 后果系统配置 */
    effectsConfig?: EffectsConfig;
    /** 后果确认弹窗文案配置 */
    effectConfirmUi?: EffectConfirmUiConfig;
    /** 资源消耗配置 */
    resourceBurners?: ResourceBurner[];
    /** 预设快捷操作区（标题右侧小图标） */
    quickActions?: PresetQuickAction[];
    /** 检定后自动修改“当前属性” */
    currentAttrAutoUpdate?: CurrentAttrAutoUpdate;
    /** 二级/多级效果配置（可选） */
    secondaryEffects?: SecondaryEffect[];
    /** 二级效果链最大深度（可选，默认 3） */
    secondaryMaxDepth?: number;
    /** 二级效果触发策略（first=首命中，all=全部命中） */
    secondaryTriggerMode?: 'first' | 'all';

    /** 检定建议表中 <检定规则> 标签的提示词分段 */
    checkSuggestionGuide?: CheckSuggestionGuide;
    /** 检定建议表 DSL 的参数名和值别名 */
    checkSuggestionAliases?: CheckSuggestionAliases;

    /** 孤注一掷配置 (COC7等规则) */
    pushedRoll?: {
      /** 是否启用 */
      enabled: boolean;
      /** 允许push的outcome ID列表 (匹配到这些outcome才显示push按钮)
       *  未定义时: 回退到 isSuccess === false 的行为（向后兼容） */
      pushableOutcomes?: string[];
      /** 禁止push的outcome ID列表 (优先于pushableOutcomes) */
      blockedOutcomes?: string[];
      /** 排除的属性名模式 (通配符,如 'SAN*','*闪避*') */
      excludePatterns?: string[];
      /** @deprecated 使用 blockedOutcomes: ['crit_failure'] 替代 */
      blockOnCritFailure?: boolean;
      /** push后各outcome的输出标注
       *  key: outcome ID 或 '*'(默认)
       *  value: 标注文本 */
      outcomeLabels?: Record<string, string>;
    };

    // 错误处理
    errorHandling?: {
      undefinedVariable: 'zero' | 'error';
      parseError: 'fail' | 'warn';
    };
  }

  interface PendingEffectContext {
    runId: string;
    historyIndex: number;
    messageId?: string;
    expiresAt?: number;
    preset: AdvancedDicePreset;
    matchedOutcome: OutcomeLevel;
    context: {
      characterName: string;
      attributeName: string;
      attributeValue: number;
      roll: number;
      modifier: number;
      dc: number;
    };
    effectOverrides?: ComputedEffect[];
    /** 进入当前结果分支的说明文本（用于确认弹窗与注入文本） */
    branchReasonText?: string;
    /** 本次检定写入输入栏的 meta 原文，用于多结果追加时定位效果注入位置 */
    sourceMetaText?: string;
    timestamp: number;
  }

  const COC7_CHECK_SUGGESTION_ALIASES: CheckSuggestionAliases = {
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

  const COC7_CHECK_SUGGESTION_GUIDE: CheckSuggestionGuide = {
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

  const COC7_GROWTH_CHECK_SUGGESTION_GUIDE: CheckSuggestionGuide = {
    rule: '使用 CoC7 幕间成长检定：掷 1d100，结果大于当前技能值时表示技能获得成长机会。该预设主要用于幕间或阶段结算，不适合作为普通行动成败判定。',
    dsl: '成长检定：检定 <角色> <技能> [成长值=1d10]\n' + '固定成功：必成\n固定失败：必败\n无需检定：无',
    examples:
      '1. 展示文本：<user>在幕间整理案件记录，检视侦查技能是否成长。\n' +
      '   骰子命令：检定 <user> 侦查 成长值=1d10\n' +
      '2. 展示文本：某个技能没有经历足够压力，不进行成长检定。\n' +
      '   骰子命令：无',
  };

  const DND5E_CHECK_SUGGESTION_ALIASES: CheckSuggestionAliases = {
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

  const DND5E_CHECK_SUGGESTION_GUIDE: CheckSuggestionGuide = {
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

  const FATE_CHECK_SUGGESTION_GUIDE: CheckSuggestionGuide = {
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

  const PBTA_CHECK_SUGGESTION_GUIDE: CheckSuggestionGuide = {
    rule: '使用 PbtA 行动检定：掷 2d6，加上属性值与临时加值；10+ 完全成功，7-9 部分成功，6- 失败。该预设不使用传统对抗检定。',
    dsl: '普通检定：检定 <角色> <属性或行动> [mod=<临时加值>]\n' + '固定成功：必成\n固定失败：必败\n无需检定：无',
    examples:
      '1. 展示文本：<user>在枪火中强行穿过废墟街口。\n' +
      '   骰子命令：检定 <user> 冷酷 mod=1\n' +
      '2. 展示文本：<角色>向风暴低语，寻找下一幕灾厄的征兆。\n' +
      '   骰子命令：检定 <角色> 怪异',
  };

  const TRIANGLE_AGENCY_CHECK_SUGGESTION_GUIDE: CheckSuggestionGuide = {
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

  // 内置高级骰子预设
  const BUILTIN_ADVANCED_PRESETS: AdvancedDicePreset[] = [
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
export {
  COC7_CHECK_SUGGESTION_ALIASES,
  COC7_CHECK_SUGGESTION_GUIDE,
  COC7_GROWTH_CHECK_SUGGESTION_GUIDE,
  DND5E_CHECK_SUGGESTION_ALIASES,
  DND5E_CHECK_SUGGESTION_GUIDE,
  FATE_CHECK_SUGGESTION_GUIDE,
  PBTA_CHECK_SUGGESTION_GUIDE,
  TRIANGLE_AGENCY_CHECK_SUGGESTION_GUIDE,
  BUILTIN_ADVANCED_PRESETS,
};
export type {
  OutcomeLevel,
  ContestRule,
  Effect,
  EffectsConfig,
  ResourceBurner,
  QuickActionBase,
  WorkflowQuickAction,
  AttrShortcutQuickAction,
  PresetQuickAction,
  CurrentAttrAutoUpdate,
  CheckSelector,
  EffectResult,
  ComputedEffect,
  EffectConfirmUiConfig,
  CheckHistoryExtension,
  EffectRunEventPayload,
  EffectReplayOperation,
  SecondaryEffect,
  FieldConfig,
  CheckSuggestionGuide,
  CheckSuggestionAliases,
  AdvancedDicePreset,
  PendingEffectContext,
};
