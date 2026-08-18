// @ts-nocheck
// 来源：src/features/dice/index.ts 章节 idx=12「PresetManager - 验证规则预设管理」
// 原行范围：4296-4794（含 banner 4293-4794）；拆分批次 6；外部 closure 依赖：9（Store@29 / PRESET_FORMAT_VERSION@3 / BUILTIN_VALIDATION_RULES@9 / compareVersion@3 / parseJsoncRecord@29 / isRecordValue@29 / STORAGE_KEY_VALIDATION_RULES@9 / STORAGE_KEY_VALIDATION_ENABLED@9 / isNpcTableName@1）
// 接线说明：PRESET_FORMAT_VERSION@3 已拆至 engine/preset-constants.ts（叶子模块）、BUILTIN_VALIDATION_RULES/STORAGE_KEY_VALIDATION_RULES/STORAGE_KEY_VALIDATION_ENABLED@9 已拆至 validation-rule-manager.ts、
//   isNpcTableName@1 已拆至 engine/primary-keys.ts、compareVersion@3 随本批次拆至 favorites/bookmark-manager.ts（均不引用本文件，无循环）直接 import；
//   Store/parseJsoncRecord/isRecordValue@29 定义于 index.ts IIFE 内无法 export，采用运行时注入：
//   index.ts IIFE 末尾调用 __wirePresetManagerDeps({ Store, parseJsoncRecord, isRecordValue }) 注入；
//   未注入时模块级引用为 null（方法仅在运行时调用，注入先于任何调用，与 IIFE 内原时序等价）。
//   本文件同时包含 ValidationRuleManager（sections.json 中定义于 idx 12，ValidationEngine@16 的 __wire 注入由 index.ts 侧继续用 import 后的符号提供）。

import { PRESET_FORMAT_VERSION } from '../engine/preset-constants';
import { BUILTIN_VALIDATION_RULES, STORAGE_KEY_VALIDATION_RULES, STORAGE_KEY_VALIDATION_ENABLED } from './validation-rule-manager';
import { isNpcTableName } from '../engine/primary-keys';
import { compareVersion } from '../favorites/bookmark-manager';

let Store = null;
let parseJsoncRecord = null;
let isRecordValue = null;

export function __wirePresetManagerDeps(deps) {
  Store = deps.Store;
  parseJsoncRecord = deps.parseJsoncRecord;
  isRecordValue = deps.isRecordValue;
}
  // ========================================
  // PresetManager - 验证规则预设管理
  // ========================================
  const STORAGE_KEY_PRESETS = 'acu_validation_presets_v1';
  const STORAGE_KEY_ACTIVE_PRESET = 'acu_active_preset_id';

  const PresetManager = {
    _cache: null,

    // 获取所有预设（自动检测并更新版本）
    getAllPresets() {
      const stored = Store.get(STORAGE_KEY_PRESETS, null);
      if (!stored) {
        this._initDefaultPreset();
        return this._cache;
      }

      let needsSave = false;
      stored.forEach(preset => {
        if (!preset.version || this._compareVersion(preset.version, PRESET_FORMAT_VERSION) < 0) {
          console.log(
            `[DICE]PresetManager 检测到预设 "${preset.name}" 版本较旧 (${preset.version || '无版本'})，自动更新`,
          );

          if (preset.id === 'default') {
            // 默认预设：强制替换内置规则，只保留用户自定义规则和开关状态
            const customRules = preset.rules.filter(r => !r.builtin);
            // 创建现有内置规则的开关状态映射
            const existingBuiltinMap = new Map();
            preset.rules
              .filter(r => r.builtin)
              .forEach(r => {
                const key = r.id || r.targetTable + '_' + r.ruleType;
                existingBuiltinMap.set(key, { enabled: r.enabled, intercept: r.intercept });
              });
            // 替换内置规则，保留用户的开关设置
            preset.rules = [
              ...BUILTIN_VALIDATION_RULES.map(r => {
                const key = r.id || r.targetTable + '_' + r.ruleType;
                const existing = existingBuiltinMap.get(key);
                return {
                  ...r,
                  builtin: true,
                  ...(existing ? { enabled: existing.enabled, intercept: existing.intercept } : {}),
                };
              }),
              ...customRules,
            ];
          } else {
            // 用户预设：智能合并（保留用户对内置规则的修改）
            this._mergeBuiltinRules(preset);
          }

          preset.version = PRESET_FORMAT_VERSION;
          needsSave = true;
        }
      });

      if (needsSave) {
        this._save(stored);
        ValidationRuleManager.clearCache();
        this._cache = null;
      }

      if (!needsSave && this._cache) {
        return this._cache;
      }
      this._cache = stored;
      return stored;
    },

    // 获取当前激活的预设
    getActivePreset() {
      const presets = this.getAllPresets();
      const activeId = Store.get(STORAGE_KEY_ACTIVE_PRESET, 'default');
      return presets.find(p => p.id === activeId) || presets[0];
    },

    // 设置激活预设
    setActivePreset(id) {
      if (!this.getAllPresets().find(p => p.id === id)) return false;
      Store.set(STORAGE_KEY_ACTIVE_PRESET, id);
      ValidationRuleManager.clearCache();
      console.log('[DICE]PresetManager 切换预设:', id);
      return true;
    },

    // 创建新预设
    createPreset(name) {
      const presets = this.getAllPresets();
      const newPreset = {
        id: 'preset_' + Date.now(),
        name: name || '新预设',
        builtin: false,
        rules: [],
        version: PRESET_FORMAT_VERSION,
        createdAt: new Date().toISOString(),
      };
      presets.push(newPreset);
      this._save(presets);
      return newPreset;
    },

    // 复制预设
    duplicatePreset(id) {
      const source = this.getAllPresets().find(p => p.id === id);
      if (!source) return null;
      const presets = this.getAllPresets();
      const newPreset = {
        id: 'preset_' + Date.now(),
        name: source.name + ' (副本)',
        builtin: false,
        rules: JSON.parse(JSON.stringify(source.rules)),
        version: source.version || PRESET_FORMAT_VERSION,
        createdAt: new Date().toISOString(),
      };
      presets.push(newPreset);
      this._save(presets);
      console.log('[DICE]PresetManager 复制预设:', source.name, '->', newPreset.name);
      return newPreset;
    },

    // 删除预设（只保护 id='default' 的默认预设）
    deletePreset(id) {
      const presets = this.getAllPresets();
      const preset = presets.find(p => p.id === id);
      if (!preset || preset.id === 'default') return false; // 只保护默认预设
      const filtered = presets.filter(p => p.id !== id);
      this._save(filtered);
      if (Store.get(STORAGE_KEY_ACTIVE_PRESET) === id) {
        Store.set(STORAGE_KEY_ACTIVE_PRESET, 'default');
        ValidationRuleManager.clearCache();
      }
      console.log('[DICE]PresetManager 删除预设:', id);
      return true;
    },

    // 更新预设规则
    updatePresetRules(id, rules) {
      const presets = this.getAllPresets();
      const preset = presets.find(p => p.id === id);
      if (!preset) return false;
      preset.rules = rules;
      this._save(presets);
      ValidationRuleManager.clearCache();
      return true;
    },

    // 导出预设
    exportPreset(id) {
      const preset = this.getAllPresets().find(p => p.id === id);
      if (!preset) return null;
      const json = JSON.stringify(
        {
          format: 'acu_preset_v1',
          version: PRESET_FORMAT_VERSION,
          preset: { name: preset.name, rules: preset.rules },
        },
        null,
        2,
      );
      return json;
    },

    // 比较版本号（使用全局函数）
    _compareVersion(v1, v2) {
      return compareVersion(v1, v2);
    },

    // 合并预设与默认值（智能合并：保留用户自定义，添加新规则，更新默认值）
    mergePresetWithDefaults(presetId) {
      const presets = this.getAllPresets();
      const preset = presets.find(p => p.id === presetId);
      if (!preset) return false;

      // 分离内置规则和用户自定义规则
      const customRules = preset.rules.filter(r => !r.builtin);
      const builtinRuleIds = new Set(BUILTIN_VALIDATION_RULES.map(r => r.id || r.targetTable + '_' + r.ruleType));

      // 创建内置规则映射（用于检测用户是否修改过）
      const builtinRuleMap = new Map();
      BUILTIN_VALIDATION_RULES.forEach(r => {
        const key = r.id || r.targetTable + '_' + r.ruleType;
        builtinRuleMap.set(key, r);
      });

      // 合并规则：保留用户自定义，添加新规则，更新未修改的默认值
      const mergedRules = [];
      const processedCustomIds = new Set();

      // 1. 添加所有内置规则（如果用户未修改，使用新版本；如果修改过，保留用户版本）
      BUILTIN_VALIDATION_RULES.forEach(newRule => {
        const key = newRule.id || newRule.targetTable + '_' + newRule.ruleType;
        const existingRule = preset.rules.find(r => (r.id || r.targetTable + '_' + r.ruleType) === key && r.builtin);
        if (existingRule) {
          // 检查用户是否修改过（简单比较：如果规则内容完全相同，认为未修改）
          const isModified = JSON.stringify(existingRule) !== JSON.stringify(newRule);
          if (isModified) {
            // 用户修改过，保留用户版本但标记为内置（以便后续更新）
            mergedRules.push({ ...existingRule, builtin: true });
          } else {
            // 未修改，使用新版本
            mergedRules.push({ ...newRule, builtin: true });
          }
        } else {
          // 新规则，直接添加
          mergedRules.push({ ...newRule, builtin: true });
        }
        processedCustomIds.add(key);
      });

      // 2. 添加用户自定义规则（不属于内置规则的）
      customRules.forEach(rule => {
        const key = rule.id || rule.targetTable + '_' + rule.ruleType;
        if (!builtinRuleIds.has(key)) {
          mergedRules.push({ ...rule, builtin: false });
        }
      });

      preset.rules = mergedRules;
      preset.version = PRESET_FORMAT_VERSION;
      this._save(presets);
      ValidationRuleManager.clearCache();
      console.log('[DICE]PresetManager 合并预设:', preset.name);
      return true;
    },

    // 导入预设
    importPreset(json, autoMerge = false) {
      try {
        const data = parseJsoncRecord(json, '验证规则预设');
        if (data.format !== 'acu_preset_v1' || !isRecordValue(data.preset)) return null;

        const importedVersion = typeof data.version === 'string' && data.version.trim() ? data.version : '0.0.0';
        const needsMerge = this._compareVersion(importedVersion, PRESET_FORMAT_VERSION) < 0;

        const presets = this.getAllPresets();
        const newPreset = {
          id: 'imported_' + Date.now(),
          name: typeof data.preset.name === 'string' && data.preset.name.trim() ? data.preset.name : '导入的预设',
          builtin: false,
          rules: Array.isArray(data.preset.rules) ? data.preset.rules : [],
          version: importedVersion,
          createdAt: new Date().toISOString(),
        };

        // 如果版本较旧且允许自动合并，则合并
        if (needsMerge && autoMerge) {
          presets.push(newPreset);
          this._save(presets);
          this.mergePresetWithDefaults(newPreset.id);
          console.log('[DICE]PresetManager 导入并合并预设:', newPreset.name);
        } else {
          presets.push(newPreset);
          this._save(presets);
          console.log('[DICE]PresetManager 导入预设:', newPreset.name);
          if (needsMerge) {
            console.warn('[DICE]PresetManager 预设版本较旧，建议使用 mergePresetWithDefaults 方法合并新版本的默认值');
          }
        }

        return { preset: newPreset, needsMerge: needsMerge && !autoMerge };
      } catch (e) {
        console.error('[DICE]PresetManager 导入失败:', e);
        return null;
      }
    },

    // 初始化默认预设
    _initDefaultPreset() {
      const stored = Store.get(STORAGE_KEY_PRESETS, null);

      // 如果已有存储数据，直接使用（版本更新逻辑在 getAllPresets 中处理）
      if (stored && Array.isArray(stored)) {
        this._cache = stored;
        return;
      }

      // 首次初始化：创建默认预设
      const defaultPreset = {
        id: 'default',
        name: '默认预设',
        builtin: true,
        rules: BUILTIN_VALIDATION_RULES.map(r => ({ ...r })),
        version: PRESET_FORMAT_VERSION,
        createdAt: new Date().toISOString(),
      };

      // 迁移旧版自定义规则
      const oldCustom = Store.get(STORAGE_KEY_VALIDATION_RULES, []);
      if (oldCustom.length > 0) {
        defaultPreset.rules.push(...oldCustom.map(r => ({ ...r, builtin: false })));
        console.log('[DICE]PresetManager 迁移旧规则:', oldCustom.length, '条');
      }

      this._cache = [defaultPreset];
      this._save(this._cache);
      Store.set(STORAGE_KEY_ACTIVE_PRESET, 'default');
    },

    // 恢复默认预设的规则
    resetDefaultPreset() {
      const presets = this.getAllPresets();
      const defaultPreset = presets.find(p => p.id === 'default');
      if (defaultPreset) {
        // 保留自定义规则（非内置规则）
        const customRules = defaultPreset.rules.filter(r => !r.builtin);
        defaultPreset.rules = [...BUILTIN_VALIDATION_RULES.map(r => ({ ...r })), ...customRules];
        defaultPreset.version = PRESET_FORMAT_VERSION;
        this._save(presets);
        ValidationRuleManager.clearCache();
        return true;
      }
      return false;
    },

    // 智能合并内置规则（用于非默认预设）
    _mergeBuiltinRules(preset) {
      const customRules = preset.rules.filter(r => !r.builtin);
      const builtinRuleIds = new Set(BUILTIN_VALIDATION_RULES.map(r => r.id || r.targetTable + '_' + r.ruleType));

      // 创建现有内置规则映射
      const existingBuiltinMap = new Map();
      preset.rules
        .filter(r => r.builtin)
        .forEach(r => {
          const key = r.id || r.targetTable + '_' + r.ruleType;
          existingBuiltinMap.set(key, r);
        });

      const mergedRules = [];

      // 处理内置规则：新增的用新版本，已有的保留用户修改
      BUILTIN_VALIDATION_RULES.forEach(newRule => {
        const key = newRule.id || newRule.targetTable + '_' + newRule.ruleType;
        const existing = existingBuiltinMap.get(key);
        if (existing) {
          // 保留用户的启用状态、拦截设置和错误消息，但更新规则定义
          mergedRules.push({
            ...newRule,
            enabled: existing.enabled,
            intercept: existing.intercept,
            errorMessage: existing.errorMessage,
            builtin: true,
          });
        } else {
          mergedRules.push({ ...newRule, builtin: true });
        }
      });

      // 添加用户自定义规则（排除与内置规则ID冲突的）
      customRules.forEach(rule => {
        const key = rule.id || rule.targetTable + '_' + rule.ruleType;
        if (!builtinRuleIds.has(key)) {
          mergedRules.push({ ...rule, builtin: false });
        }
      });

      preset.rules = mergedRules;
    },

    _save(presets) {
      Store.set(STORAGE_KEY_PRESETS, presets);
      this._cache = presets;
    },

    clearCache() {
      this._cache = null;
    },
  };

  // 验证规则管理器（从 PresetManager 获取规则）
  const ValidationRuleManager = {
    _cache: null,
    _enabledCache: null,

    // 获取所有规则（从当前激活预设）
    getAllRules() {
      if (this._cache) return this._cache;

      const preset = PresetManager.getActivePreset();
      const enabledStates = this.getEnabledStates();

      // 应用启用状态
      const allRules = (preset?.rules || []).map(rule => ({
        ...rule,
        enabled: enabledStates[rule.id] !== undefined ? enabledStates[rule.id] : rule.enabled,
      }));

      this._cache = allRules;
      return allRules;
    },

    // 获取启用状态映射
    getEnabledStates() {
      if (this._enabledCache) return this._enabledCache;
      this._enabledCache = Store.get(STORAGE_KEY_VALIDATION_ENABLED, {});
      return this._enabledCache;
    },

    // 切换规则启用状态
    toggleRuleEnabled(ruleId, enabled) {
      const states = this.getEnabledStates();
      states[ruleId] = enabled;
      Store.set(STORAGE_KEY_VALIDATION_ENABLED, states);
      this._enabledCache = states;
      this._cache = null; // 清除缓存以便下次重新计算
    },

    // 切换规则拦截状态
    toggleRuleIntercept(ruleId, intercept) {
      const preset = PresetManager.getActivePreset();
      if (!preset) return false;

      const rule = preset.rules.find(r => r.id === ruleId);
      if (!rule) return false;

      rule.intercept = intercept;
      PresetManager.updatePresetRules(preset.id, preset.rules);
      return true;
    },

    // 获取启用的规则
    getEnabledRules() {
      return this.getAllRules().filter(rule => rule.enabled);
    },

    // 添加自定义规则（到当前激活预设）
    addCustomRule(rule) {
      if (!rule.id || !rule.name || !rule.targetTable) {
        console.error('[DICE]ValidationRuleManager 规则缺少必要字段');
        return false;
      }

      const preset = PresetManager.getActivePreset();
      if (!preset) return false;

      // 检查 ID 是否重复
      if (preset.rules.some(r => r.id === rule.id)) {
        console.error('[DICE]ValidationRuleManager 规则 ID 已存在:', rule.id);
        return false;
      }

      const newRule = { ...rule, builtin: false, enabled: true };
      preset.rules.push(newRule);
      PresetManager.updatePresetRules(preset.id, preset.rules);
      console.log('[DICE]ValidationRuleManager 添加规则:', newRule.name);
      return true;
    },

    // 删除规则
    removeCustomRule(ruleId) {
      const preset = PresetManager.getActivePreset();
      if (!preset) return false;

      const index = preset.rules.findIndex(r => r.id === ruleId);
      if (index === -1) return false;

      preset.rules.splice(index, 1);
      PresetManager.updatePresetRules(preset.id, preset.rules);

      // 清理启用状态
      const states = this.getEnabledStates();
      delete states[ruleId];
      Store.set(STORAGE_KEY_VALIDATION_ENABLED, states);
      this._enabledCache = states;

      console.log('[DICE]ValidationRuleManager 删除规则:', ruleId);
      return true;
    },

    // 更新规则
    updateCustomRule(ruleId, updates) {
      const preset = PresetManager.getActivePreset();
      if (!preset) return false;

      const index = preset.rules.findIndex(r => r.id === ruleId);
      if (index === -1) return false;

      preset.rules[index] = { ...preset.rules[index], ...updates, id: ruleId };
      PresetManager.updatePresetRules(preset.id, preset.rules);
      return true;
    },

    // 获取单个规则
    getRule(ruleId) {
      return this.getAllRules().find(r => r.id === ruleId);
    },

    // 清除缓存
    clearCache() {
      this._cache = null;
      this._enabledCache = null;
    },

    // 获取按表名分组的规则
    getRulesByTable(tableName) {
      return this.getEnabledRules().filter(
        rule => rule.targetTable === tableName || (isNpcTableName(rule.targetTable) && isNpcTableName(tableName)),
      );
    },
  };
export { STORAGE_KEY_PRESETS, STORAGE_KEY_ACTIVE_PRESET, PresetManager, ValidationRuleManager }; // __wirePresetManagerDeps 已由头部 export function 导出
