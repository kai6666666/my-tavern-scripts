// @ts-nocheck
/**
 * validation-rule-manager.ts
 * Feature-Sliced: features 层模块（工厂版，DI 注入依赖）。
 */

import { Store } from '../../shared/storage/store';

export function createValidationRuleManager(deps: any) {
  const ValidationRuleManager = {
    _cache: null,
    _enabledCache: null,

    // 获取所有规则（从当前激活预设）
    getAllRules() {
      if (this._cache) return this._cache;

      const preset = deps.getPresetManager().getActivePreset();
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
      this._enabledCache = Store.get(deps.STORAGE_KEY_VALIDATION_ENABLED, {});
      return this._enabledCache;
    },

    // 切换规则启用状态
    toggleRuleEnabled(ruleId, enabled) {
      const states = this.getEnabledStates();
      states[ruleId] = enabled;
      Store.set(deps.STORAGE_KEY_VALIDATION_ENABLED, states);
      this._enabledCache = states;
      this._cache = null; // 清除缓存以便下次重新计算
    },

    // 切换规则拦截状态
    toggleRuleIntercept(ruleId, intercept) {
      const preset = deps.getPresetManager().getActivePreset();
      if (!preset) return false;

      const rule = preset.rules.find(r => r.id === ruleId);
      if (!rule) return false;

      rule.intercept = intercept;
      deps.getPresetManager().updatePresetRules(preset.id, preset.rules);
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

      const preset = deps.getPresetManager().getActivePreset();
      if (!preset) return false;

      // 检查 ID 是否重复
      if (preset.rules.some(r => r.id === rule.id)) {
        console.error('[DICE]ValidationRuleManager 规则 ID 已存在:', rule.id);
        return false;
      }

      const newRule = { ...rule, builtin: false, enabled: true };
      preset.rules.push(newRule);
      deps.getPresetManager().updatePresetRules(preset.id, preset.rules);
      console.log('[DICE]ValidationRuleManager 添加规则:', newRule.name);
      return true;
    },

    // 删除规则
    removeCustomRule(ruleId) {
      const preset = deps.getPresetManager().getActivePreset();
      if (!preset) return false;

      const index = preset.rules.findIndex(r => r.id === ruleId);
      if (index === -1) return false;

      preset.rules.splice(index, 1);
      deps.getPresetManager().updatePresetRules(preset.id, preset.rules);

      // 清理启用状态
      const states = this.getEnabledStates();
      delete states[ruleId];
      Store.set(deps.STORAGE_KEY_VALIDATION_ENABLED, states);
      this._enabledCache = states;

      console.log('[DICE]ValidationRuleManager 删除规则:', ruleId);
      return true;
    },

    // 更新规则
    updateCustomRule(ruleId, updates) {
      const preset = deps.getPresetManager().getActivePreset();
      if (!preset) return false;

      const index = preset.rules.findIndex(r => r.id === ruleId);
      if (index === -1) return false;

      preset.rules[index] = { ...preset.rules[index], ...updates, id: ruleId };
      deps.getPresetManager().updatePresetRules(preset.id, preset.rules);
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
        rule => rule.targetTable === tableName || (deps.isNpcTableName(rule.targetTable) && deps.isNpcTableName(tableName)),
      );
    },
  };


  return ValidationRuleManager;
}
