// @ts-nocheck
// 来源：src/features/dice/index.ts 章节 idx=13「RegexTransformationManager - 表格正则规则管理器 (Phase 1.2)」
// 原行范围：4799-4981（含 banner 4796-4981）；拆分批次 4；外部 closure 依赖：5（Store@29 / STORAGE_KEY_REGEX_RULES@6 / STORAGE_KEY_REGEX_ENABLED@6 / filterDeprecatedBuiltinRegexRules@8 / RegexPresetManager@14）
// 接线说明：STORAGE_KEY_REGEX_RULES/STORAGE_KEY_REGEX_ENABLED 来自 regex-types.ts、filterDeprecatedBuiltinRegexRules 来自 builtin-regex-rules.ts（均已拆出且不引用本文件，无循环），直接 import；
//   Store@29 定义于 index.ts IIFE 内无法 export；RegexPresetManager@14 与本批次同拆至 regex-preset-manager.ts（两文件互引，直接 import 会形成循环），
//   均采用运行时注入：index.ts IIFE 末尾调用 __wireRegexTransformationManagerDeps({ Store, RegexPresetManager }) 注入；
//   未注入时模块级引用为 null（方法仅在运行时调用，注入先于任何调用，与 IIFE 内原时序等价）。

import { STORAGE_KEY_REGEX_RULES, STORAGE_KEY_REGEX_ENABLED } from './regex-types';
import { filterDeprecatedBuiltinRegexRules } from './builtin-regex-rules';
import type { RegexTransformationRule } from './regex-types';

let Store = null;
let RegexPresetManager = null;

export function __wireRegexTransformationManagerDeps(deps) {
  Store = deps.Store;
  RegexPresetManager = deps.RegexPresetManager;
}
  // ========================================
  // RegexTransformationManager - 表格正则规则管理器 (Phase 1.2)
  // ========================================
  const RegexTransformationManager = {
    _cache: null,
    _enabledCache: null,

    // 生成唯一ID
    _generateId() {
      return `regex_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },

    // 获取所有规则
    getAllRules() {
      if (this._cache) return this._cache;

      const storedRules = Store.get(STORAGE_KEY_REGEX_RULES, []);
      const rules = Array.isArray(storedRules) ? storedRules : [];
      const filteredRules = filterDeprecatedBuiltinRegexRules(rules);
      if (filteredRules.length !== rules.length) {
        Store.set(STORAGE_KEY_REGEX_RULES, filteredRules);
      }
      // 直接使用规则中存储的 enabled 状态，不再从全局 enabledStates 覆盖
      // 这确保了每个预设的开关状态是独立的
      this._cache = filteredRules;
      return filteredRules;
    },

    // 获取启用状态映射
    getEnabledStates() {
      if (this._enabledCache) return this._enabledCache;
      this._enabledCache = Store.get(STORAGE_KEY_REGEX_ENABLED, {});
      return this._enabledCache;
    },

    // 保存启用状态
    _saveEnabledStates(states) {
      Store.set(STORAGE_KEY_REGEX_ENABLED, states);
      this._enabledCache = states;
    },

    // 获取启用的规则
    getEnabledRules() {
      return this.getAllRules().filter(rule => rule.enabled !== false);
    },

    // 根据作用域获取适用的规则
    getApplicableRules(tableName, columnName) {
      const allRules = this.getEnabledRules();

      return allRules
        .filter(rule => {
          // 检查作用域是否匹配
          switch (rule.scope.type) {
            case 'global':
              return true;
            case 'table':
              return rule.scope.tableNames && rule.scope.tableNames.includes(tableName);
            case 'column':
              return (
                rule.scope.tableNames &&
                rule.scope.tableNames.includes(tableName) &&
                rule.scope.columnNames &&
                rule.scope.columnNames.includes(columnName)
              );
            default:
              return false;
          }
        })
        .sort((a, b) => b.priority - a.priority); // 按优先级降序排列
    },

    // 切换规则启用状态
    toggleRuleEnabled(ruleId, enabled) {
      // 更新 STORAGE_KEY_REGEX_RULES 中的规则状态
      const rules = Store.get(STORAGE_KEY_REGEX_RULES, []);
      const ruleIndex = rules.findIndex(r => r.id === ruleId);
      if (ruleIndex !== -1) {
        rules[ruleIndex].enabled = enabled;
        Store.set(STORAGE_KEY_REGEX_RULES, rules);
      }

      // 同时更新当前激活预设中的规则状态
      const activePreset = RegexPresetManager.getActivePreset();
      if (activePreset) {
        RegexPresetManager.updatePresetRules(activePreset.id, rules);
      }

      this.clearCache();
    },

    // 添加自定义规则
    addCustomRule(rule) {
      const rules = Store.get(STORAGE_KEY_REGEX_RULES, []);

      // 验证必填字段
      if (!rule.name || !rule.pattern || !rule.scope) {
        console.error('[DICE]RegexTransformationManager: 规则缺少必填字段');
        return false;
      }

      const newRule: RegexTransformationRule = {
        id: this._generateId(),
        name: rule.name,
        description: rule.description,
        operation: rule.operation || 'replace',
        pattern: rule.pattern,
        flags: rule.flags || {},
        replacement: rule.replacement,
        scope: rule.scope,
        enabled: rule.enabled !== undefined ? rule.enabled : true,
        priority: rule.priority || 50,
        executeMode: rule.executeMode || 'auto',
        testCases: rule.testCases || [],
        security: rule.security || { maxMatchTime: 100, maxMatches: 1000, maxInputLength: 10000 },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      rules.push(newRule);
      Store.set(STORAGE_KEY_REGEX_RULES, rules);
      this.clearCache();

      // 同步规则到当前激活预设
      this._syncRulesToActivePreset();

      return newRule;
    },

    // 同步规则到当前激活预设
    _syncRulesToActivePreset() {
      const activePreset = RegexPresetManager.getActivePreset();
      if (activePreset) {
        const allRules = Store.get(STORAGE_KEY_REGEX_RULES, []);
        RegexPresetManager.updatePresetRules(activePreset.id, allRules);
      }
    },

    // 删除规则
    removeRule(ruleId) {
      const rules = Store.get(STORAGE_KEY_REGEX_RULES, []);
      const index = rules.findIndex(r => r.id === ruleId);
      if (index === -1) return false;

      rules.splice(index, 1);
      Store.set(STORAGE_KEY_REGEX_RULES, rules);
      this.clearCache();

      // 同步规则到当前激活预设
      this._syncRulesToActivePreset();

      return true;
    },

    // 更新规则
    updateRule(ruleId, updates) {
      const rules = Store.get(STORAGE_KEY_REGEX_RULES, []);
      const index = rules.findIndex(r => r.id === ruleId);
      if (index === -1) return false;

      rules[index] = {
        ...rules[index],
        ...updates,
        id: ruleId,
        updatedAt: Date.now(),
      };
      Store.set(STORAGE_KEY_REGEX_RULES, rules);
      this.clearCache();

      // 同步规则到当前激活预设
      this._syncRulesToActivePreset();

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
  };
export { RegexTransformationManager }; // __wireRegexTransformationManagerDeps 已由头部 export function 导出
