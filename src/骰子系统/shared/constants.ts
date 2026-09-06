// @ts-nocheck
/**
 * shared/constants.ts
 * Feature-Sliced: shared 层 - 无业务逻辑的全局常量与版本号。
 * 由 index.ts（app 层）统一引入，集中维护，避免散布在单体内。
 */

// ========================================
// 脚本标识
// ========================================
export const SCRIPT_ID = 'acu_visualizer_ui_v19_6_ai_overlay';
export const DICE_ROOT_CLASS = 'acu-dice-ui-root';
export const DICE_ROOT_SELECTOR = `.acu-wrapper.${DICE_ROOT_CLASS}`;
export const HOST_REGENERATE_HIDDEN_CLASS = 'acu-host-regenerate-hidden';
export const HOST_REGENERATE_BUTTON_SELECTOR = '.swipeRightBlock, .swipe_right';

// ========================================
// 表主键配置 (用于行标识转换)
// ========================================
export const PRIMARY_KEYS = {
  全局数据表: null as null,
  世界地图点: '详细地点',
  地图元素表: '元素名称',
  主角信息: '姓名',
  重要人物表: '姓名',
  重要角色表: '姓名',
  技能表: '技能名称',
  物品表: '物品名称',
  装备表: '装备名称',
  任务表: '名称',
  总结表: '编码索引',
  总体大纲: '编码索引',
  重要情报: '情报名称',
  势力: '名称',
};

// ========================================
// 版本号
// ========================================
// 预设格式版本号（全局共享，用于数据验证规则、管理属性规则等）
export const PRESET_FORMAT_VERSION = '1.8.4';
// 脚本版本号
export const SCRIPT_VERSION = 'v6.68';

// ========================================
// 纯逻辑工具（无副作用）
// ========================================
// 兼容新旧模板表名（重要人物表 = 旧名, 重要角色表 = 新名）
export const isNpcTableName = (name: string): boolean => name === '重要人物表' || name === '重要角色表';
