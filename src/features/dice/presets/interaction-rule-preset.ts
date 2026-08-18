// @ts-nocheck
// 来源：src/features/dice/index.ts 章节 idx=26「交互规则预设系统」
// 原行范围：16324-16532（含 banner 16299-16532）；拆分批次 5；外部 closure 依赖：5（PRESET_FORMAT_VERSION@3 / Store@29 / STORAGE_KEY_ACTION_PRESETS@3 / STORAGE_KEY_ACTIVE_ACTION_PRESET@3 / parseJsoncRecord@29）
// 接线说明：PRESET_FORMAT_VERSION/STORAGE_KEY_ACTION_PRESETS/STORAGE_KEY_ACTIVE_ACTION_PRESET 已随批次 5 拆至 engine/preset-constants.ts（0 依赖叶子模块），直接 import；
//   顶层 BUILTIN_ACTION_PRESETS 数组在模块求值时即读取真实值，不受接线时序影响；
//   Store/parseJsoncRecord@29 定义于 index.ts IIFE 内无法 export，采用运行时注入：
//   index.ts IIFE 末尾调用 __wireInteractionRulePresetDeps({ Store, parseJsoncRecord }) 注入；
//   未注入时模块级引用为 null（方法仅在运行时调用，注入先于任何调用，与 IIFE 内原时序等价）。

import { PRESET_FORMAT_VERSION, STORAGE_KEY_ACTION_PRESETS, STORAGE_KEY_ACTIVE_ACTION_PRESET } from '../engine/preset-constants';

let Store = null;
let parseJsoncRecord = null;

export function __wireInteractionRulePresetDeps(deps) {
  Store = deps.Store;
  parseJsoncRecord = deps.parseJsoncRecord;
}
  // ========================================
  // 交互规则预设系统
  // ========================================

  // ActionPresetManager 类型定义（仅用于文档，实际是 JS 对象）
  // interface ActionGroupPreset {
  //   format: 'acu_action_preset_v1';
  //   version: string;
  //   id: string;
  //   name: string;
  //   builtin: boolean;
  //   description?: string;
  //   rules: ActionRule[];
  // }
  // interface ActionRule {
  //   table_keywords: string[];
  //   actions: ActionItem[];
  // }
  // interface ActionItem {
  //   label: string;
  //   icon?: string;
  //   template?: string;
  // }

  // 内置默认交互规则预设
  const BUILTIN_ACTION_PRESETS = [
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

  const ActionPresetManager = (() => {
    let _cache = null;

    return {
      // 获取所有预设（内置 + 用户自定义）
      getAllPresets() {
        if (_cache) return _cache;
        const stored = Store.get(STORAGE_KEY_ACTION_PRESETS, []);
        _cache = [...BUILTIN_ACTION_PRESETS, ...stored];
        return _cache;
      },

      // 根据ID获取单个预设
      getPresetById(id) {
        return this.getAllPresets().find(p => p.id === id) || null;
      },

      // 获取当前激活的预设ID（默认为内置预设）
      getActivePresetId() {
        const stored = Store.get(STORAGE_KEY_ACTIVE_ACTION_PRESET, '__builtin_default__');
        return stored === null ? '__builtin_default__' : stored;
      },

      // 获取当前激活的预设
      getActivePreset() {
        const activeId = this.getActivePresetId();
        if (!activeId || activeId === '__none__') return null;
        return this.getPresetById(activeId);
      },

      // 设置激活的预设（'__none__' 表示全部关闭）
      setActivePresetId(id) {
        try {
          const finalId = id === '' || id === undefined || id === null ? '__none__' : id;
          Store.set(STORAGE_KEY_ACTIVE_ACTION_PRESET, finalId);
          _cache = null;
          console.log('[DICE]ActionPresetManager 切换预设:', finalId);
          return true;
        } catch (err) {
          console.error('[DICE]ActionPresetManager 设置预设失败:', err);
          return false;
        }
      },

      // 创建自定义预设
      createPreset(preset) {
        const stored = Store.get(STORAGE_KEY_ACTION_PRESETS, []);
        const newPreset = {
          format: 'acu_action_preset_v1',
          version: PRESET_FORMAT_VERSION,
          ...preset,
          id: preset.id || 'custom_' + Date.now(),
          builtin: false,
          createdAt: new Date().toISOString(),
        };
        stored.push(newPreset);
        Store.set(STORAGE_KEY_ACTION_PRESETS, stored);
        _cache = null;
        console.log('[DICE]ActionPresetManager 创建预设:', newPreset.name);
        return newPreset;
      },

      // 更新自定义预设
      updatePreset(id, updates) {
        const stored = Store.get(STORAGE_KEY_ACTION_PRESETS, []);
        const index = stored.findIndex(p => p.id === id);
        if (index < 0) return false;
        stored[index] = { ...stored[index], ...updates, version: PRESET_FORMAT_VERSION };
        Store.set(STORAGE_KEY_ACTION_PRESETS, stored);
        _cache = null;
        console.log('[DICE]ActionPresetManager 更新预设:', id);
        return true;
      },

      // 删除自定义预设
      deletePreset(id) {
        const stored = Store.get(STORAGE_KEY_ACTION_PRESETS, []);
        const filtered = stored.filter(p => p.id !== id);
        if (filtered.length === stored.length) return false;
        Store.set(STORAGE_KEY_ACTION_PRESETS, filtered);
        _cache = null;
        // 如果删除的是激活预设，清除激活状态
        if (Store.get(STORAGE_KEY_ACTIVE_ACTION_PRESET) === id) {
          Store.set(STORAGE_KEY_ACTIVE_ACTION_PRESET, null);
        }
        console.log('[DICE]ActionPresetManager 删除预设:', id);
        return true;
      },

      // 导出预设为 JSON
      exportPreset(id) {
        const preset = this.getPresetById(id);
        if (!preset) return null;
        const exported = {
          format: 'acu_action_preset_v1',
          version: PRESET_FORMAT_VERSION,
          ...preset,
        };
        delete exported.builtin;
        delete exported.createdAt;
        return JSON.stringify(exported, null, 2);
      },

      // 从 JSON/JSONC 导入预设
      importPreset(jsonStr) {
        try {
          const data = parseJsoncRecord(jsonStr, '交互规则预设');

          // 校验格式
          if (data.format !== 'acu_action_preset_v1') {
            throw new Error('不支持的预设格式，需要 acu_action_preset_v1');
          }

          // 基本校验
          if (typeof data.name !== 'string' || !data.name.trim() || !Array.isArray(data.rules)) {
            throw new Error('预设数据不完整，需要 name 和 rules 字段');
          }

          // 生成新ID避免冲突
          const imported = {
            ...data,
            id: 'imported_' + Date.now(),
            builtin: false,
            version: PRESET_FORMAT_VERSION,
            createdAt: new Date().toISOString(),
          };

          const result = this.createPreset(imported);
          return result;
        } catch (e) {
          console.error('[DICE]ActionPresetManager 导入失败:', e);
          return null;
        }
      },

      // 清除缓存
      clearCache() {
        _cache = null;
      },
    };
  })();
export { BUILTIN_ACTION_PRESETS, ActionPresetManager }; // __wireInteractionRulePresetDeps 已由头部 export function 导出
