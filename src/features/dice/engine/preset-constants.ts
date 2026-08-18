// @ts-nocheck
// 来源：src/features/dice/index.ts 章节 idx=3「BookmarkManager」尾部常量簇（预设/存储键/版本常量）
// 原行范围：2497-2524（重构前 bak 行号；13 个存储键 + CUSTOM_ROLL_MODE + DEFAULT_CRAZY_MODE_CONFIG + PRESET_FORMAT_VERSION + SCRIPT_VERSION）；拆分批次 5；外部 closure 依赖：0
// 说明：纯字面量常量（0 依赖叶子模块），供 presets/ 模块与 index.ts IIFE 直接 import；
//   顶层常量在模块求值时即可获得真实值，不受 __wire 接线时序影响（解决 idx 22/23/26 顶层 BUILTIN_*_PRESETS 数组求值期读取问题）。
// 恢复说明：2026-08-18 该文件在后续批次中被意外删除，依据 .refactor-tools/extract-preset-constants.js 的 EXPECTED 清单重建；SCRIPT_VERSION 已由 v6.65 更新为 v6.66。

const STORAGE_KEY_ATTRIBUTE_PRESETS = 'acu_attribute_presets_v1';
const STORAGE_KEY_ACTIVE_ATTR_PRESET = 'acu_active_attr_preset_v1';
const STORAGE_KEY_ACTION_PRESETS = 'acu_action_presets_v1';
const STORAGE_KEY_ACTIVE_ACTION_PRESET = 'acu_active_action_preset_v1';
const STORAGE_KEY_DASHBOARD_PRESETS = 'acu_dashboard_presets_v1';
const STORAGE_KEY_ACTIVE_DASHBOARD_PRESET = 'acu_active_dashboard_preset_v1';
const STORAGE_KEY_ADVANCED_PRESETS = 'acu_advanced_presets_v1';
const STORAGE_KEY_TABLE_TEMPLATE_REQUIREMENT_PRESETS = 'acu_table_template_requirement_presets_v1';
const STORAGE_KEY_ACTIVE_TABLE_TEMPLATE_REQUIREMENT_PRESET = 'acu_active_table_template_requirement_preset_v1';
const STORAGE_KEY_BUILTIN_PRESET_VISIBILITY = 'acu_builtin_preset_visibility';
const STORAGE_KEY_BUILTIN_PRESET_ORDER = 'acu_builtin_preset_order';
const STORAGE_KEY_LAST_PRESET = 'acu_dice_last_preset';
const STORAGE_KEY_CRAZY_MODE = 'acu_dice_crazy_mode';
// 自定义掷骰模式常量
const CUSTOM_ROLL_MODE = {
  id: '__custom__',
  name: '自定义',
} as const;
const DEFAULT_CRAZY_MODE_CONFIG = {
  enabled: false,
  crazyLevel: 50,
  playerWeight: 80,
  inSceneNpcWeight: 15,
  offSceneNpcWeight: 5,
};
const PRESET_FORMAT_VERSION = '1.8.4'; // 预设格式版本号（全局共享，用于数据验证规则、管理属性规则等）
const SCRIPT_VERSION = 'v6.66'; // 脚本版本号

export {
  STORAGE_KEY_ATTRIBUTE_PRESETS,
  STORAGE_KEY_ACTIVE_ATTR_PRESET,
  STORAGE_KEY_ACTION_PRESETS,
  STORAGE_KEY_ACTIVE_ACTION_PRESET,
  STORAGE_KEY_DASHBOARD_PRESETS,
  STORAGE_KEY_ACTIVE_DASHBOARD_PRESET,
  STORAGE_KEY_ADVANCED_PRESETS,
  STORAGE_KEY_TABLE_TEMPLATE_REQUIREMENT_PRESETS,
  STORAGE_KEY_ACTIVE_TABLE_TEMPLATE_REQUIREMENT_PRESET,
  STORAGE_KEY_BUILTIN_PRESET_VISIBILITY,
  STORAGE_KEY_BUILTIN_PRESET_ORDER,
  STORAGE_KEY_LAST_PRESET,
  STORAGE_KEY_CRAZY_MODE,
  CUSTOM_ROLL_MODE,
  DEFAULT_CRAZY_MODE_CONFIG,
  PRESET_FORMAT_VERSION,
  SCRIPT_VERSION,
};
