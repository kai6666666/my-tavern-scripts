// @ts-nocheck
/**
 * shared/defaults-config.ts
 * Feature-Sliced: batch extract (FSD batch A1).
 */


export const DEFAULT_GM_CONFIG = {
    enabled: true,
    diceSystem: '1d100',
    showDiceIcon: true,
    autoSendPrompt: true,
    action_groups: [
      {
        table_keywords: ['地点', '地图', 'Location', 'Map', '世界', '场所'],
        actions: [
          { label: '前往', icon: 'fa-walking', type: 'prompt', template: '<user>前往{Name}。', auto_send: true },
          { label: '探索', icon: 'fa-search', type: 'prompt', template: '<user>探索{Name}。', auto_send: true },
          { label: '停留', icon: 'fa-clock', type: 'prompt', template: '<user>在{Name}停留。', auto_send: true },
        ],
      },
      {
        table_keywords: ['人物', 'NPC', '重要人物', '角色', '女主'],
        actions: [
          { label: '交谈', icon: 'fa-comments', type: 'prompt', template: '<user>与{Name}交谈。', auto_send: true },
          { label: '观察', icon: 'fa-eye', type: 'prompt', template: '<user>观察{Name}。', auto_send: true },
          { label: '战斗', icon: 'fa-hand-fist', type: 'prompt', template: '<user>与{Name}战斗。', auto_send: true },
        ],
      },
      {
        table_keywords: ['物品', '背包', '道具'],
        actions: [
          { label: '使用', icon: 'fa-hand-pointer', type: 'prompt', template: '<user>使用了{Name}。', auto_send: true },
          { label: '查看', icon: 'fa-eye', type: 'prompt', template: '<user>查看了{Name}。', auto_send: true },
          { label: '丢弃', icon: 'fa-trash', type: 'prompt', template: '<user>丢弃了{Name}。', auto_send: true },
        ],
      },
      {
        table_keywords: ['装备', '武器', '防具'],
        actions: [
          {
            label: '装备',
            icon: 'fa-shield-halved',
            type: 'prompt',
            template: '<user>装备了{Name}。',
            auto_send: true,
          },
          { label: '卸下', icon: 'fa-circle-xmark', type: 'prompt', template: '<user>卸下了{Name}。', auto_send: true },
          { label: '卖出', icon: 'fa-coins', type: 'prompt', template: '<user>卖出了{Name}。', auto_send: true },
        ],
      },
      {
        table_keywords: ['技能', '能力'],
        actions: [
          {
            label: '使用',
            icon: 'fa-wand-magic-sparkles',
            type: 'skill_check',
            template: '<user>使用{Name}。',
            auto_send: true,
          },
          { label: '练习', icon: 'fa-dumbbell', type: 'prompt', template: '<user>练习{Name}。', auto_send: true },
        ],
      },
      {
        table_keywords: ['备忘', '任务', '事项'],
        actions: [
          {
            label: '追踪',
            icon: 'fa-crosshairs',
            type: 'prompt',
            template: '<user>将{Name}设为当前追踪目标。',
            auto_send: true,
          },
          {
            label: '整理',
            icon: 'fa-list-check',
            type: 'prompt',
            template: '<user>整理关于{Name}的信息。',
            auto_send: true,
          },
          { label: '放弃', icon: 'fa-circle-xmark', type: 'prompt', template: '<user>放弃了{Name}。', auto_send: true },
        ],
      },
      {
        table_keywords: ['势力', '组织', '阵营'],
        actions: [
          {
            label: '打探',
            icon: 'fa-ear-listen',
            type: 'prompt',
            template: '<user>打探{Name}的情报。',
            auto_send: true,
          },
          { label: '加入', icon: 'fa-user-plus', type: 'prompt', template: '<user>申请加入{Name}。', auto_send: true },
          {
            label: '合作',
            icon: 'fa-handshake',
            type: 'prompt',
            template: '<user>向{Name}请求合作。',
            auto_send: true,
          },
        ],
      },
    ],
  };

export const DEFAULT_CONFIG = {
    layout: 'horizontal',
    collapseStyle: 'bar',
    collapseAlign: 'right',
    fontFamily: 'default',
    theme: 'native',
    cardWidth: 260,
    fontSize: 13,
    highlightNew: true,
    itemsPerPage: 50,
    actionsPosition: 'bottom',
    gridColumns: 'auto', // [修改] 默认为智能自动列数
    desktopNavAligned: false,
    showHorizontalScrollbar: true,
    positionMode: 'fixed', // fixed=悬浮底部, embedded=跟随消息, viewport=固定底部
    showOptionPanel: true, // [新增] 显示选项面板
    clickOptionToAutoSend: true, // [新增] 点击选项自动发送
    optionFontSize: 12, // [新增] 选项面板独立字体大小
    navFontSize: 13,
    floatingCollapsePosition: null as null | { left: number; top: number },
    muteDatabaseToasts: false,
    dialogueIndentEnabled: false,
    dialogueIndentStrategy: 'conservative',
  };

export const DEFAULT_DICE_CONFIG = {
    critSuccessMax: 5,
    hardSuccessDiv: 5,
    difficultSuccessDiv: 2,
    critFailMin: 96,
    ruleType: 'high_good',
    lastDiceType: '1d100',
    // DND 专用配置
    dndCritSuccess: 20,
    dndCritFail: 1,
    // 对抗平手规则: initiator_lose | tie | initiator_win
    contestTieRule: 'initiator_lose',
    // 多次投骰时覆盖上一次检定结果；关闭后追加到旧结果后面
    overwriteLastDiceResult: true,
    // 隐藏输入栏中的检定结果
    hideDiceResultFromUser: false,
    // 隐藏聊天记录中的检定结果
    hideDiceResultInChat: false,
    autoMergeProtagonist: true,
  };

export const DEFAULT_VIRTUAL_PRESET = {
    id: '__default__',
    name: '六维属性百分制',
    baseAttributes: ['力量', '敏捷', '体质', '智力', '感知', '魅力'].map(name => ({
      name,
      formula: '3d6*5',
      range: [5, 95] as [number, number],
      modifier: '1d10-5',
    })),
    specialAttributes: [] as { name: string; formula: string; range: [number, number]; modifier: string }[],
  };

export const DEFAULT_CRAZY_MODE_CONFIG = {
    enabled: false,
    crazyLevel: 50,
    playerWeight: 80,
    inSceneNpcWeight: 15,
    offSceneNpcWeight: 5,
  };

export const DEFAULT_SPECIAL_ATTR_TEMPLATE = {
    // 主角信息表和重要人物表统一的默认内容
    range: [0, 100] as [number, number],
    // 默认示例（分号分隔格式）
    example: '爆裂魔法:85; 时间回溯:70; 超电磁炮:90',
  };

export const RULE_TYPE_INFO = {
    // 表级规则
    tableReadonly: { name: '表级只读', scope: 'table', icon: 'fa-lock', desc: '禁止修改整个表' },
    rowLimit: { name: '行数限制', scope: 'table', icon: 'fa-arrows-up-down', desc: '限制表的行数范围' },
    sequence: { name: '序列递增', scope: 'table', icon: 'fa-sort-numeric-up', desc: '检查字段值是否严格递增' },
    // 字段级规则
    required: { name: '必填', scope: 'field', icon: 'fa-asterisk', desc: '字段不能为空' },
    format: { name: '格式验证', scope: 'field', icon: 'fa-font', desc: '正则表达式匹配' },
    enum: { name: '枚举验证', scope: 'field', icon: 'fa-list', desc: '值必须在列表中' },
    numeric: { name: '数值范围', scope: 'field', icon: 'fa-hashtag', desc: '数值必须在范围内' },
    relation: { name: '关联验证', scope: 'field', icon: 'fa-link', desc: '引用其他表的值' },
    keyValue: { name: '键值对验证', scope: 'field', icon: 'fa-key', desc: '验证键值对格式和数值范围' },
  };

export const INVENTORY_QUALITY_ORDER = {
    普通: 1,
    优秀: 2,
    稀有: 3,
    史诗: 4,
    传说: 5,
    神话: 6,
    唯一: 7,
  };
