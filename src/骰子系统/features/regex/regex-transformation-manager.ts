// @ts-nocheck
/**
 * regex-transformation-manager.ts
 * Feature-Sliced: features 层模块（工厂版，DI 注入依赖）。
 */

import { Store } from '../../shared/storage/store';

export function createRegexTransformationManager(deps: any) {
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
      const filteredRules = deps.filterDeprecatedBuiltinRegexRules(rules);
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
      this._enabledCache = Store.get(deps.STORAGE_KEY_REGEX_ENABLED, {});
      return this._enabledCache;
    },

    // 保存启用状态
    _saveEnabledStates(states) {
      Store.set(deps.STORAGE_KEY_REGEX_ENABLED, states);
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
      const activePreset = deps.getRegexPresetManager().getActivePreset();
      if (activePreset) {
        deps.getRegexPresetManager().updatePresetRules(activePreset.id, rules);
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
      const activePreset = deps.getRegexPresetManager().getActivePreset();
      if (activePreset) {
        const allRules = Store.get(STORAGE_KEY_REGEX_RULES, []);
        deps.getRegexPresetManager().updatePresetRules(activePreset.id, allRules);
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


  return RegexTransformationManager;
}
