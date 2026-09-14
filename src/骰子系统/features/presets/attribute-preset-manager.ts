// @ts-nocheck
/**
 * attribute-preset-manager.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { PRESET_FORMAT_VERSION } from '../../shared/constants';
import { Store } from '../../shared/storage/store';
export function createAttributePresetManager(deps: any) {
  const AttributePresetManager = (() => {
    let _cache = null;

    return {
      // 获取所有预设（内置 + 自定义，自动检测并更新版本）
      getAllPresets() {
        const stored = Store.get(deps.STORAGE_KEY_ATTRIBUTE_PRESETS, []) as AttributePresetConfig[];
        // 自动检测并更新所有自定义预设的版本（每次调用都检测，不依赖缓存）
        let needsSave = false;
        stored.forEach(preset => {
          const presetVersion = preset.version || '0.0.0';
          if (deps.compareVersion(presetVersion, PRESET_FORMAT_VERSION) < 0) {
            console.log(
              `[DICE]AttributePresetManager 检测到预设 "${preset.name}" 版本较旧 (${presetVersion})，自动更新到 ${PRESET_FORMAT_VERSION}`,
            );
            preset.version = PRESET_FORMAT_VERSION;
            needsSave = true;
          }
          if (deps.applyAttributeQuickSelectDefaults(preset)) {
            needsSave = true;
          }
        });
        if (needsSave) {
          Store.set(deps.STORAGE_KEY_ATTRIBUTE_PRESETS, stored);
          // 清除缓存，确保下次获取时使用更新后的数据
          _cache = null;
        }
        // 只有在没有更新时才使用缓存
        if (!needsSave && _cache) {
          return _cache;
        }
        _cache = [...deps.BUILTIN_ATTRIBUTE_PRESETS, ...stored];
        return _cache;
      },

      // 获取当前激活的预设（null = 使用默认逻辑）
      getActivePreset() {
        const activeId = Store.get(deps.STORAGE_KEY_ACTIVE_ATTR_PRESET, null);
        if (!activeId) return null;
        return this.getAllPresets().find(p => p.id === activeId) || null;
      },

      // 设置激活的预设
      setActivePreset(id) {
        try {
          // 如果id是空字符串，设置为null
          const finalId = id === '' || id === undefined ? null : id;
          Store.set(deps.STORAGE_KEY_ACTIVE_ATTR_PRESET, finalId);
          // 清除缓存，确保下次获取时是最新的
          _cache = null;
          console.log('[DICE]AttributePresetManager 切换预设:', finalId);
          console.info('[DICE][属性规则同步] 属性预设切换已触发', {
            inputId: id,
            finalId,
            activeStoredId: Store.get(deps.STORAGE_KEY_ACTIVE_ATTR_PRESET, null),
          });
          // 延迟调用以确保函数已定义（函数在 AttributePresetManager 之后定义）
          setTimeout(() => {
            console.info('[DICE][属性规则同步] 准备执行模板同步', {
              finalId,
              hasUpdater: typeof deps.updateTemplateForActivePreset === 'function',
            });
            if (typeof deps.updateTemplateForActivePreset === 'function') {
              deps.updateTemplateForActivePreset(finalId);
            } else {
              console.warn('[DICE][属性规则同步] updateTemplateForActivePreset 不可用，跳过同步');
            }
          }, 0);
          return true;
        } catch (err) {
          console.error('[DICE]AttributePresetManager 设置预设失败:', err);
          return false;
        }
      },

      // 创建自定义预设
      createPreset(preset) {
        const stored = Store.get(deps.STORAGE_KEY_ATTRIBUTE_PRESETS, []) as AttributePresetConfig[];
        const newPreset = {
          ...preset,
          id: preset.id || 'custom_' + Date.now(),
          builtin: false,
          version: preset.version || PRESET_FORMAT_VERSION,
          createdAt: new Date().toISOString(),
        };
        deps.applyAttributeQuickSelectDefaults(newPreset);
        stored.push(newPreset);
        Store.set(deps.STORAGE_KEY_ATTRIBUTE_PRESETS, stored);
        _cache = null;
        console.log('[DICE]AttributePresetManager 创建预设:', newPreset.name);
        return newPreset;
      },

      // 更新自定义预设
      updatePreset(id, updates) {
        const stored = Store.get(deps.STORAGE_KEY_ATTRIBUTE_PRESETS, []) as AttributePresetConfig[];
        const index = stored.findIndex(p => p.id === id);
        if (index < 0) return false;
        const nextPreset = { ...stored[index], ...updates };
        deps.applyAttributeQuickSelectDefaults(nextPreset);
        stored[index] = nextPreset;
        Store.set(deps.STORAGE_KEY_ATTRIBUTE_PRESETS, stored);
        _cache = null;
        console.log('[DICE]AttributePresetManager 更新预设:', id);
        return true;
      },

      // 删除自定义预设
      deletePreset(id) {
        const stored = Store.get(deps.STORAGE_KEY_ATTRIBUTE_PRESETS, []) as AttributePresetConfig[];
        const filtered = stored.filter(p => p.id !== id);
        if (filtered.length === stored.length) return false;
        Store.set(deps.STORAGE_KEY_ATTRIBUTE_PRESETS, filtered);
        _cache = null;
        // 如果删除的是激活预设，清除激活状态
        if (Store.get(deps.STORAGE_KEY_ACTIVE_ATTR_PRESET) === id) {
          Store.set(deps.STORAGE_KEY_ACTIVE_ATTR_PRESET, null);
        }
        console.log('[DICE]AttributePresetManager 删除预设:', id);
        return true;
      },

      // 导出预设为 JSON
      exportPreset(id) {
        const preset = this.getAllPresets().find(p => p.id === id);
        if (!preset) return null;
        const exported = {
          format: 'acu_attr_preset_v1',
          version: PRESET_FORMAT_VERSION,
          ...preset,
        };
        delete exported.builtin; // 导出时移除内置标记
        return JSON.stringify(exported, null, 2);
      },

      // 从 JSON/JSONC 导入预设
      importPreset(jsonStr, autoUpdate = false) {
        try {
          const data = deps.parseJsoncRecord(jsonStr, '属性预设');

          // 校验格式
          if (data.format !== 'acu_attr_preset_v1') {
            throw new Error('不支持的预设格式');
          }

          // 基本校验
          if (typeof data.name !== 'string' || !data.name.trim() || !Array.isArray(data.baseAttributes)) {
            throw new Error('预设数据不完整');
          }

          const importedVersion = typeof data.version === 'string' && data.version.trim() ? data.version : '0.0.0';
          const needsUpdate = deps.compareVersion(importedVersion, PRESET_FORMAT_VERSION) < 0;

          // 生成新ID避免冲突
          const imported = {
            ...data,
            id: 'imported_' + Date.now(),
            builtin: false,
            version: autoUpdate && needsUpdate ? PRESET_FORMAT_VERSION : importedVersion,
            createdAt: new Date().toISOString(),
          };

          const result = this.createPreset(imported);
          if (result && needsUpdate && !autoUpdate) {
            console.warn(
              `[DICE]AttributePresetManager 导入的预设 "${result.name}" 版本较旧 (${importedVersion})，建议更新到 ${PRESET_FORMAT_VERSION}`,
            );
          }
          return result;
        } catch (e) {
          console.error('[DICE]AttributePresetManager 导入失败:', e);
          return null;
        }
      },

      // 清除缓存
      clearCache() {
        _cache = null;
      },
    };
  })();
  return AttributePresetManager;
}
