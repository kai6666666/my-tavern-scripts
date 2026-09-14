// @ts-nocheck
/**
 * action-preset-manager.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { PRESET_FORMAT_VERSION } from '../../shared/constants';
import { Store } from '../../shared/storage/store';
export function createActionPresetManager(deps: any) {
  const ActionPresetManager = (() => {
    let _cache = null;

    return {
      // 获取所有预设（内置 + 用户自定义）
      getAllPresets() {
        if (_cache) return _cache;
        const stored = Store.get(deps.STORAGE_KEY_ACTION_PRESETS, []);
        _cache = [...deps.BUILTIN_ACTION_PRESETS, ...stored];
        return _cache;
      },

      // 根据ID获取单个预设
      getPresetById(id) {
        return this.getAllPresets().find(p => p.id === id) || null;
      },

      // 获取当前激活的预设ID（默认为内置预设）
      getActivePresetId() {
        const stored = Store.get(deps.STORAGE_KEY_ACTIVE_ACTION_PRESET, '__builtin_default__');
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
          Store.set(deps.STORAGE_KEY_ACTIVE_ACTION_PRESET, finalId);
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
        const stored = Store.get(deps.STORAGE_KEY_ACTION_PRESETS, []);
        const newPreset = {
          format: 'acu_action_preset_v1',
          version: PRESET_FORMAT_VERSION,
          ...preset,
          id: preset.id || 'custom_' + Date.now(),
          builtin: false,
          createdAt: new Date().toISOString(),
        };
        stored.push(newPreset);
        Store.set(deps.STORAGE_KEY_ACTION_PRESETS, stored);
        _cache = null;
        console.log('[DICE]ActionPresetManager 创建预设:', newPreset.name);
        return newPreset;
      },

      // 更新自定义预设
      updatePreset(id, updates) {
        const stored = Store.get(deps.STORAGE_KEY_ACTION_PRESETS, []);
        const index = stored.findIndex(p => p.id === id);
        if (index < 0) return false;
        stored[index] = { ...stored[index], ...updates, version: PRESET_FORMAT_VERSION };
        Store.set(deps.STORAGE_KEY_ACTION_PRESETS, stored);
        _cache = null;
        console.log('[DICE]ActionPresetManager 更新预设:', id);
        return true;
      },

      // 删除自定义预设
      deletePreset(id) {
        const stored = Store.get(deps.STORAGE_KEY_ACTION_PRESETS, []);
        const filtered = stored.filter(p => p.id !== id);
        if (filtered.length === stored.length) return false;
        Store.set(deps.STORAGE_KEY_ACTION_PRESETS, filtered);
        _cache = null;
        // 如果删除的是激活预设，清除激活状态
        if (Store.get(deps.STORAGE_KEY_ACTIVE_ACTION_PRESET) === id) {
          Store.set(deps.STORAGE_KEY_ACTIVE_ACTION_PRESET, null);
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
          const data = deps.parseJsoncRecord(jsonStr, '交互规则预设');

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
  return ActionPresetManager;
}
