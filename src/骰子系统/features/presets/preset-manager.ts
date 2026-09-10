// @ts-nocheck
/**
 * preset-manager.ts
 * Feature-Sliced: features 层模块（工厂版，DI 注入依赖）。
 */

import { Store } from '../../shared/storage/store';
import { PRESET_FORMAT_VERSION } from '../../shared/constants';

export function createPresetManager(deps: any) {
  const PresetManager = {
    _cache: null,

    // 获取所有预设（自动检测并更新版本）
    getAllPresets() {
      const stored = Store.get(deps.STORAGE_KEY_PRESETS, null);
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
        deps.getValidationRuleManager().clearCache();
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
      const activeId = Store.get(deps.STORAGE_KEY_ACTIVE_PRESET, 'default');
      return presets.find(p => p.id === activeId) || presets[0];
    },

    // 设置激活预设
    setActivePreset(id) {
      if (!this.getAllPresets().find(p => p.id === id)) return false;
      Store.set(deps.STORAGE_KEY_ACTIVE_PRESET, id);
      deps.getValidationRuleManager().clearCache();
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
      if (Store.get(deps.STORAGE_KEY_ACTIVE_PRESET) === id) {
        Store.set(deps.STORAGE_KEY_ACTIVE_PRESET, 'default');
        deps.getValidationRuleManager().clearCache();
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
      deps.getValidationRuleManager().clearCache();
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
      return deps.compareVersion(v1, v2);
    },

    // 合并预设与默认值（智能合并：保留用户自定义，添加新规则，更新默认值）
    mergePresetWithDefaults(presetId) {
      const presets = this.getAllPresets();
      const preset = presets.find(p => p.id === presetId);
      if (!preset) return false;

      // 分离内置规则和用户自定义规则
      const customRules = preset.rules.filter(r => !r.builtin);
      const builtinRuleIds = new Set(deps.BUILTIN_VALIDATION_RULES.map(r => r.id || r.targetTable + '_' + r.ruleType));

      // 创建内置规则映射（用于检测用户是否修改过）
      const builtinRuleMap = new Map();
      deps.BUILTIN_VALIDATION_RULES.forEach(r => {
        const key = r.id || r.targetTable + '_' + r.ruleType;
        builtinRuleMap.set(key, r);
      });

      // 合并规则：保留用户自定义，添加新规则，更新未修改的默认值
      const mergedRules = [];
      const processedCustomIds = new Set();

      // 1. 添加所有内置规则（如果用户未修改，使用新版本；如果修改过，保留用户版本）
      deps.BUILTIN_VALIDATION_RULES.forEach(newRule => {
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
      deps.getValidationRuleManager().clearCache();
      console.log('[DICE]PresetManager 合并预设:', preset.name);
      return true;
    },

    // 导入预设
    importPreset(json, autoMerge = false) {
      try {
        const data = deps.parseJsoncRecord(json, '验证规则预设');
        if (data.format !== 'acu_preset_v1' || !deps.isRecordValue(data.preset)) return null;

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
      const stored = Store.get(deps.STORAGE_KEY_PRESETS, null);

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
        rules: deps.BUILTIN_VALIDATION_RULES.map(r => ({ ...r })),
        version: PRESET_FORMAT_VERSION,
        createdAt: new Date().toISOString(),
      };

      // 迁移旧版自定义规则
      const oldCustom = Store.get(deps.STORAGE_KEY_VALIDATION_RULES, []);
      if (oldCustom.length > 0) {
        defaultPreset.rules.push(...oldCustom.map(r => ({ ...r, builtin: false })));
        console.log('[DICE]PresetManager 迁移旧规则:', oldCustom.length, '条');
      }

      this._cache = [defaultPreset];
      this._save(this._cache);
      Store.set(deps.STORAGE_KEY_ACTIVE_PRESET, 'default');
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
        deps.getValidationRuleManager().clearCache();
        return true;
      }
      return false;
    },

    // 智能合并内置规则（用于非默认预设）
    _mergeBuiltinRules(preset) {
      const customRules = preset.rules.filter(r => !r.builtin);
      const builtinRuleIds = new Set(deps.BUILTIN_VALIDATION_RULES.map(r => r.id || r.targetTable + '_' + r.ruleType));

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
      deps.BUILTIN_VALIDATION_RULES.forEach(newRule => {
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
      Store.set(deps.STORAGE_KEY_PRESETS, presets);
      this._cache = presets;
    },

    clearCache() {
      this._cache = null;
    },
  };


  return PresetManager;
}
