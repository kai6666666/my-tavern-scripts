// @ts-nocheck
/**
 * builtin-action-presets.ts
 * Feature-Sliced 模块（数据常量）。
 */
import { PRESET_FORMAT_VERSION } from '../../shared/constants';

export const BUILTIN_ACTION_PRESETS = [
    {
      format: 'acu_action_preset_v1',
      version: PRESET_FORMAT_VERSION,
      id: '__builtin_default__',
      name: '默认交互规则',
      builtin: true,
      description: '基于表格类型的默认交互选项，包含地点、人物、物品、装备、技能、任务、势力等常用规则',
      rules: [
        {
          table_keywords: ['地点', '地图', 'Location', 'Map', '世界', '场所'],
          actions: [
            { label: '前往', template: '<user>前往{Name}。' },
            { label: '探索', template: '<user>探索{Name}。' },
            { label: '停留', template: '<user>在{Name}停留。' },
          ],
        },
        {
          table_keywords: ['人物', 'NPC', '重要人物', '角色', '女主'],
          actions: [
            { label: '交谈', template: '<user>与{Name}交谈。' },
            { label: '观察', template: '<user>观察{Name}。' },
            { label: '战斗', template: '<user>与{Name}战斗。' },
          ],
        },
        {
          table_keywords: ['物品', '背包', '道具'],
          actions: [
            { label: '使用', template: '<user>使用了{Name}。' },
            { label: '查看', template: '<user>查看了{Name}。' },
            { label: '丢弃', template: '<user>丢弃了{Name}。' },
          ],
        },
        {
          table_keywords: ['装备', '武器', '防具'],
          actions: [
            { label: '装备', template: '<user>装备了{Name}。' },
            { label: '卸下', template: '<user>卸下了{Name}。' },
            { label: '卖出', template: '<user>卖出了{Name}。' },
          ],
        },
        {
          table_keywords: ['技能', '能力'],
          actions: [
            { label: '使用', template: '<user>使用{Name}。' },
            { label: '练习', template: '<user>练习{Name}。' },
          ],
        },
        {
          table_keywords: ['备忘', '任务', '事项'],
          actions: [
            { label: '追踪', template: '<user>将{Name}设为当前追踪目标。' },
            { label: '整理', template: '<user>整理关于{Name}的信息。' },
            { label: '放弃', template: '<user>放弃了{Name}。' },
          ],
        },
        {
          table_keywords: ['势力', '组织', '阵营'],
          actions: [
            { label: '打探', template: '<user>打探{Name}的情报。' },
            { label: '加入', template: '<user>申请加入{Name}。' },
            { label: '合作', template: '<user>向{Name}请求合作。' },
          ],
        },
      ],
    },
  ];
