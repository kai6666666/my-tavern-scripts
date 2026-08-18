// @ts-nocheck
// 来源：src/features/dice/index.ts 章节 idx=14「RegexPresetManager - 表格正则预设管理器 (Phase 1.3)」
// 原行范围：4986-5304（含 banner 4983-5304）；拆分批次 4；外部 closure 依赖：10（compareVersion@3 / Store@29 / STORAGE_KEY_REGEX_PRESETS@6 / PRESET_FORMAT_VERSION@3 / BUILTIN_REGEX_RULES@8 / filterDeprecatedBuiltinRegexRules@8 / RegexTransformationManager@13 / STORAGE_KEY_REGEX_ACTIVE_PRESET@6 / STORAGE_KEY_REGEX_RULES@6 / parseJsoncRecord@29）
// 接线说明：STORAGE_KEY_REGEX_PRESETS/STORAGE_KEY_REGEX_ACTIVE_PRESET/STORAGE_KEY_REGEX_RULES 来自 regex-types.ts、BUILTIN_REGEX_RULES/filterDeprecatedBuiltinRegexRules 来自 builtin-regex-rules.ts（均已拆出且不引用本文件，无循环），直接 import；
//   compareVersion/PRESET_FORMAT_VERSION@3、Store/parseJsoncRecord@29 定义于 index.ts IIFE 内无法 export；RegexTransformationManager@13 与本批次同拆至 regex-transformation-manager.ts（两文件互引，直接 import 会形成循环），
//   均采用运行时注入：index.ts IIFE 末尾调用 __wireRegexPresetManagerDeps({ compareVersion, Store, PRESET_FORMAT_VERSION, parseJsoncRecord, RegexTransformationManager }) 注入；
//   未注入时模块级引用为 null（方法仅在运行时调用，注入先于任何调用，与 IIFE 内原时序等价）。

import { STORAGE_KEY_REGEX_PRESETS, STORAGE_KEY_REGEX_ACTIVE_PRESET, STORAGE_KEY_REGEX_RULES } from './regex-types';
import { BUILTIN_REGEX_RULES, filterDeprecatedBuiltinRegexRules } from './builtin-regex-rules';
import type { RegexPreset, RegexTransformationRule } from './regex-types';

let compareVersion = null;
let Store = null;
let PRESET_FORMAT_VERSION = null;
let parseJsoncRecord = null;
let RegexTransformationManager = null;

export function __wireRegexPresetManagerDeps(deps) {
  compareVersion = deps.compareVersion;
  Store = deps.Store;
  PRESET_FORMAT_VERSION = deps.PRESET_FORMAT_VERSION;
  parseJsoncRecord = deps.parseJsoncRecord;
  RegexTransformationManager = deps.RegexTransformationManager;
}
  // ========================================
  // RegexPresetManager - 表格正则预设管理器 (Phase 1.3)
  // ========================================
  const RegexPresetManager = {
    _cache: null,

    // 版本比较（复用全局 compareVersion）
    _compareVersion(v1, v2) {
      return compareVersion(v1, v2);
    },

    // 获取所有预设（自动检测并更新版本）
    getAllPresets() {
      const stored = Store.get(STORAGE_KEY_REGEX_PRESETS, null);

      // 首次初始化
      if (!stored || stored.length === 0) {
        const defaultPreset: RegexPreset = {
          id: 'regex_default',
          name: '默认预设',
          description: '系统默认的表格正则预设',
          version: PRESET_FORMAT_VERSION,
          rules: BUILTIN_REGEX_RULES.map(r => ({ ...r, builtin: true })),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        this._cache = [defaultPreset];
        Store.set(STORAGE_KEY_REGEX_PRESETS, this._cache);
        return this._cache;
      }

      // 自动检测并更新版本
      let needsSave = false;
      stored.forEach(preset => {
        if (Array.isArray(preset.rules)) {
          const filteredRules = filterDeprecatedBuiltinRegexRules(preset.rules);
          if (filteredRules.length !== preset.rules.length) {
            preset.rules = filteredRules;
            preset.updatedAt = Date.now();
            needsSave = true;
          }
        }

        if (!preset.version || this._compareVersion(preset.version, PRESET_FORMAT_VERSION) < 0) {
          console.log(
            `[DICE]RegexPresetManager 检测到预设 "${preset.name}" 版本较旧 (${preset.version || '无版本'})，自动更新`,
          );

          if (preset.id === 'regex_default') {
            // 默认预设：强制替换内置规则，只保留用户自定义规则和开关状态
            const customRules = (preset.rules || []).filter(r => !r.builtin);
            // 创建现有内置规则的开关状态映射
            const existingBuiltinMap = new Map();
            (preset.rules || [])
              .filter(r => r.builtin)
              .forEach(r => {
                existingBuiltinMap.set(r.id, { enabled: r.enabled });
              });
            // 替换内置规则，保留用户的开关设置
            preset.rules = [
              ...BUILTIN_REGEX_RULES.map(r => {
                const existing = existingBuiltinMap.get(r.id);
                return {
                  ...r,
                  builtin: true,
                  ...(existing ? { enabled: existing.enabled } : {}),
                };
              }),
              ...customRules,
            ];
          } else {
            // 用户预设：智能合并
            this._mergeBuiltinRules(preset);
          }

          preset.version = PRESET_FORMAT_VERSION;
          preset.updatedAt = Date.now();
          needsSave = true;
        }
      });

      if (needsSave) {
        this._save(stored);
        RegexTransformationManager.clearCache();
        this._cache = null;
      }

      if (!needsSave && this._cache) {
        return this._cache;
      }
      this._cache = stored;
      return stored;
    },

    // 智能合并内置规则（用于非默认预设）
    _mergeBuiltinRules(preset) {
      const customRules = (preset.rules || []).filter(r => !r.builtin);
      const builtinRuleIds = new Set(BUILTIN_REGEX_RULES.map(r => r.id));

      // 创建现有内置规则映射
      const existingBuiltinMap = new Map();
      (preset.rules || [])
        .filter(r => r.builtin)
        .forEach(r => {
          existingBuiltinMap.set(r.id, r);
        });

      const mergedRules = [];

      // 处理内置规则：新增的用新版本，已有的保留用户修改
      BUILTIN_REGEX_RULES.forEach(newRule => {
        const existing = existingBuiltinMap.get(newRule.id);
        if (existing) {
          // 保留用户的启用状态，但更新规则定义
          mergedRules.push({
            ...newRule,
            enabled: existing.enabled,
            builtin: true,
          });
        } else {
          mergedRules.push({ ...newRule, builtin: true });
        }
      });

      // 添加用户自定义规则（排除与内置规则ID冲突的）
      customRules.forEach(rule => {
        if (!builtinRuleIds.has(rule.id)) {
          mergedRules.push({ ...rule, builtin: false });
        }
      });

      preset.rules = mergedRules;
    },

    // 获取当前激活的预设
    getActivePreset() {
      const activeId = Store.get(STORAGE_KEY_REGEX_ACTIVE_PRESET, 'regex_default');
      const presets = this.getAllPresets();
      const preset = presets.find(p => p.id === activeId) || presets[0];

      // 确保规则存储与当前激活预设同步
      // 检查预设中的内置规则是否已存在于规则存储中，如果缺失则合并
      const storedRules: RegexTransformationRule[] = Store.get(STORAGE_KEY_REGEX_RULES, []);
      const activeStoredRules = filterDeprecatedBuiltinRegexRules(storedRules);
      if (activeStoredRules.length !== storedRules.length) {
        Store.set(STORAGE_KEY_REGEX_RULES, activeStoredRules);
        RegexTransformationManager.clearCache();
      }
      if (preset && preset.rules && preset.rules.length > 0) {
        // 找出预设中标记为 builtin 但存储中缺失的规则
        const storedRuleIds = new Set(activeStoredRules.map(r => r.id));
        const missingBuiltinRules = preset.rules.filter(r => r.builtin && !storedRuleIds.has(r.id));

        if (missingBuiltinRules.length > 0) {
          // 将缺失的内置规则添加到存储的规则列表开头
          const mergedRules = [...missingBuiltinRules, ...activeStoredRules];
          Store.set(STORAGE_KEY_REGEX_RULES, mergedRules);
          RegexTransformationManager.clearCache();
          console.log(`[DICE]RegexPresetManager: 已合并 ${missingBuiltinRules.length} 条缺失的内置规则`);
        }
      }

      return preset;
    },

    // 设置激活预设
    setActivePreset(presetId) {
      const presets = this.getAllPresets();
      const preset = presets.find(p => p.id === presetId);
      if (!preset) {
        console.error('[DICE]RegexPresetManager: 预设不存在', presetId);
        return false;
      }

      Store.set(STORAGE_KEY_REGEX_ACTIVE_PRESET, presetId);

      // 同步预设规则到实际规则存储
      Store.set(STORAGE_KEY_REGEX_RULES, filterDeprecatedBuiltinRegexRules(preset.rules || []));

      // 清除RegexTransformationManager的缓存
      RegexTransformationManager.clearCache();

      return true;
    },

    // 创建新预设
    createPreset(name, sourcePresetId) {
      const presets = this.getAllPresets();

      // 验证名称不重复
      if (presets.some(p => p.name === name)) {
        console.error('[DICE]RegexPresetManager: 预设名称已存在', name);
        return false;
      }

      const sourcePreset = sourcePresetId ? presets.find(p => p.id === sourcePresetId) : this.getActivePreset();

      const newPreset: RegexPreset = {
        id: `regex_preset_${Date.now()}`,
        name: name,
        description: sourcePreset?.description,
        version: PRESET_FORMAT_VERSION,
        rules: sourcePreset ? JSON.parse(JSON.stringify(sourcePreset.rules)) : [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      presets.push(newPreset);
      this._save(presets);
      return newPreset;
    },

    // 更新预设规则
    updatePresetRules(presetId, rules) {
      const presets = this.getAllPresets();
      const index = presets.findIndex(p => p.id === presetId);
      if (index === -1) return false;

      presets[index].rules = JSON.parse(JSON.stringify(filterDeprecatedBuiltinRegexRules(rules)));
      presets[index].updatedAt = Date.now();

      this._save(presets);

      // 如果更新的是当前激活预设,清除规则缓存
      if (presetId === Store.get(STORAGE_KEY_REGEX_ACTIVE_PRESET)) {
        RegexTransformationManager.clearCache();
      }

      return true;
    },

    // 删除预设
    deletePreset(presetId) {
      const presets = this.getAllPresets();

      // 不允许删除最后一个预设
      if (presets.length <= 1) {
        console.error('[DICE]RegexPresetManager: 不能删除最后一个预设');
        return false;
      }

      const index = presets.findIndex(p => p.id === presetId);
      if (index === -1) return false;

      presets.splice(index, 1);
      this._save(presets);

      // 如果删除的是当前激活预设,切换到第一个预设
      if (presetId === Store.get(STORAGE_KEY_REGEX_ACTIVE_PRESET)) {
        this.setActivePreset(presets[0].id);
      }

      return true;
    },

    // 导出预设为JSON
    exportPreset(presetId) {
      const preset = this.getAllPresets().find(p => p.id === presetId);
      if (!preset) return null;

      // 如果是当前激活预设，从实际存储读取最新规则
      const activePreset = this.getActivePreset();
      const isActivePreset = activePreset && activePreset.id === presetId;
      const rules = filterDeprecatedBuiltinRegexRules(
        isActivePreset ? Store.get(STORAGE_KEY_REGEX_RULES, []) : preset.rules,
      );

      const exportData = {
        ...preset,
        rules: rules,
      };

      return JSON.stringify(exportData, null, 2);
    },

    // 从 JSON/JSONC 导入预设
    importPreset(jsonString) {
      try {
        const data = parseJsoncRecord(jsonString, '正则预设');

        // 验证基本结构
        if (typeof data.name !== 'string' || !data.name.trim() || !Array.isArray(data.rules)) {
          console.error('[DICE]RegexPresetManager: 预设格式无效');
          return false;
        }

        const presets = this.getAllPresets();

        // 生成新ID避免冲突
        const newPreset: RegexPreset = {
          id: `regex_preset_${Date.now()}`,
          name: data.name,
          description: typeof data.description === 'string' ? data.description : '',
          version: typeof data.version === 'string' && data.version.trim() ? data.version : PRESET_FORMAT_VERSION,
          rules: filterDeprecatedBuiltinRegexRules(data.rules as RegexTransformationRule[]).map(rule => ({
            ...rule,
            id: RegexTransformationManager._generateId(),
          })),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        presets.push(newPreset);
        this._save(presets);
        return newPreset;
      } catch (e) {
        console.error('[DICE]RegexPresetManager: 导入预设失败', e);
        return false;
      }
    },

    // 保存到存储
    _save(presets) {
      Store.set(STORAGE_KEY_REGEX_PRESETS, presets);
      this._cache = presets;
    },

    // 清除缓存
    clearCache() {
      this._cache = null;
    },
  };
export { RegexPresetManager }; // __wireRegexPresetManagerDeps 已由头部 export function 导出
