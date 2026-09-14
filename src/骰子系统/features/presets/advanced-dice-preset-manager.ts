// @ts-nocheck
/**
 * advanced-dice-preset-manager.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { PRESET_FORMAT_VERSION } from '../../shared/constants';
import { Store } from '../../shared/storage/store';
export function createAdvancedDicePresetManager(deps: any) {
  const AdvancedDicePresetManager = (() => {
    let _cache = null;
    let _lastImportError = '';

    const getBuiltinPresetVisibilityMap = (): Record<string, boolean> => {
      const stored = Store.get(deps.STORAGE_KEY_BUILTIN_PRESET_VISIBILITY, {});
      if (!stored || typeof stored !== 'object') return {};
      return stored as Record<string, boolean>;
    };

    const getBuiltinPresetOrderMap = (): Record<string, number> => {
      const stored = Store.get(deps.STORAGE_KEY_BUILTIN_PRESET_ORDER, {});
      if (!stored || typeof stored !== 'object') return {};
      return stored as Record<string, number>;
    };

    return {
      // 获取所有预设（内置 + 自定义）
      getAllPresets() {
        const stored = Store.get(deps.STORAGE_KEY_ADVANCED_PRESETS, []);
        // 自动检测并更新所有自定义预设的版本
        let needsSave = false;
        stored.forEach(preset => {
          const presetVersion = preset.version || '0.0.0';
          if (deps.compareVersion(presetVersion, PRESET_FORMAT_VERSION) < 0) {
            console.log(
              `[DICE]AdvancedDicePresetManager 检测到预设 "${preset.name}" 版本较旧 (${presetVersion})，自动更新到 ${PRESET_FORMAT_VERSION}`,
            );
            preset.version = PRESET_FORMAT_VERSION;
            needsSave = true;
          }
        });
        if (needsSave) {
          Store.set(deps.STORAGE_KEY_ADVANCED_PRESETS, stored);
          _cache = null;
        }
        // 只有在没有更新时才使用缓存
        if (!needsSave && _cache) {
          return _cache;
        }

        // 填充默认值并合并
        const builtinVisibilityMap = getBuiltinPresetVisibilityMap();
        const builtinOrderMap = getBuiltinPresetOrderMap();
        const processedBuiltin = deps.BUILTIN_ADVANCED_PRESETS.map((p, index) => ({
          ...p,
          visible: builtinVisibilityMap[p.id] ?? p.visible ?? true,
          order: builtinOrderMap[p.id] ?? p.order ?? index,
        }));

        const processedCustom = stored.map(p => ({
          ...p,
          visible: p.visible ?? false,
          order: p.order ?? 999,
        }));

        _cache = [...processedBuiltin, ...processedCustom];
        return _cache;
      },

      // 获取当前激活的预设（null = 未激活）
      getActivePreset() {
        const activeId = Store.get(deps.STORAGE_KEY_ACTIVE_ADVANCED_PRESET, null);
        if (!activeId) return null;
        return this.getAllPresets().find(p => p.id === activeId) || null;
      },

      // 设置激活的预设
      setActivePreset(id) {
        try {
          const finalId = id === '' || id === undefined ? null : id;
          Store.set(deps.STORAGE_KEY_ACTIVE_ADVANCED_PRESET, finalId);
          _cache = null;
          console.log('[DICE]AdvancedDicePresetManager 切换预设:', finalId);
          if (typeof deps.updateTemplateForActiveCheckPreset === 'function') {
            deps.updateTemplateForActiveCheckPreset(finalId);
          }
          return true;
        } catch (err) {
          console.error('[DICE]AdvancedDicePresetManager 设置预设失败:', err);
          return false;
        }
      },

      setBuiltinPresetVisibility(id, visible) {
        try {
          const map = getBuiltinPresetVisibilityMap();
          map[id] = visible;
          Store.set(deps.STORAGE_KEY_BUILTIN_PRESET_VISIBILITY, map);
          _cache = null;
          return true;
        } catch (err) {
          console.error('[DICE]AdvancedDicePresetManager 设置内置预设显示状态失败:', err);
          return false;
        }
      },

      setPresetOrder(id, order) {
        try {
          if (deps.BUILTIN_ADVANCED_PRESETS.some(p => p.id === id)) {
            const map = getBuiltinPresetOrderMap();
            map[id] = order;
            Store.set(deps.STORAGE_KEY_BUILTIN_PRESET_ORDER, map);
            _cache = null;
            return true;
          }
          return this.updatePreset(id, { order });
        } catch (err) {
          console.error('[DICE]AdvancedDicePresetManager 设置预设排序失败:', err);
          return false;
        }
      },

      // 创建自定义预设
      createPreset(preset) {
        const stored = Store.get(deps.STORAGE_KEY_ADVANCED_PRESETS, []);
        const newPreset = {
          ...preset,
          id: preset.id || 'custom_' + Date.now(),
          kind: 'advanced',
          builtin: false,
          version: preset.version || PRESET_FORMAT_VERSION,
          createdAt: new Date().toISOString(),
        };
        stored.push(newPreset);
        Store.set(deps.STORAGE_KEY_ADVANCED_PRESETS, stored);
        _cache = null;
        console.log('[DICE]AdvancedDicePresetManager 创建预设:', newPreset.name);
        return newPreset;
      },

      // 更新自定义预设
      updatePreset(id, updates) {
        // 禁止修改内置预设
        if (deps.BUILTIN_ADVANCED_PRESETS.some(p => p.id === id)) {
          console.error('[DICE]AdvancedDicePresetManager 不能修改内置预设:', id);
          throw new Error('不能修改内置预设');
        }
        const stored = Store.get(deps.STORAGE_KEY_ADVANCED_PRESETS, []);
        const index = stored.findIndex(p => p.id === id);
        if (index < 0) return false;
        stored[index] = { ...stored[index], ...updates, id }; // 保持ID不变
        Store.set(deps.STORAGE_KEY_ADVANCED_PRESETS, stored);
        _cache = null;
        console.log('[DICE]AdvancedDicePresetManager 更新预设:', id);
        return true;
      },

      // 删除自定义预设
      deletePreset(id) {
        // 禁止删除内置预设
        if (deps.BUILTIN_ADVANCED_PRESETS.some(p => p.id === id)) {
          console.error('[DICE]AdvancedDicePresetManager 不能删除内置预设:', id);
          throw new Error('不能删除内置预设');
        }
        const stored = Store.get(deps.STORAGE_KEY_ADVANCED_PRESETS, []);
        const filtered = stored.filter(p => p.id !== id);
        if (filtered.length === stored.length) return false;
        Store.set(deps.STORAGE_KEY_ADVANCED_PRESETS, filtered);
        _cache = null;
        // 如果删除的是激活预设，清除激活状态
        if (Store.get(deps.STORAGE_KEY_ACTIVE_ADVANCED_PRESET) === id) {
          Store.set(deps.STORAGE_KEY_ACTIVE_ADVANCED_PRESET, null);
        }
        console.log('[DICE]AdvancedDicePresetManager 删除预设:', id);
        return true;
      },

      // 导出预设为 JSON
      exportPreset(id) {
        const preset = this.getAllPresets().find(p => p.id === id);
        if (!preset) return null;
        const exported = {
          ...preset,
          format: deps.ADVANCED_PRESET_EXPORT_FORMAT,
          kind: 'advanced',
          version: PRESET_FORMAT_VERSION,
        };
        delete exported.builtin; // 导出时移除内置标记
        return JSON.stringify(exported, null, 2);
      },

      // 从 JSON/JSONC 导入预设
      importPreset(jsonStr) {
        const storedBefore = Store.get(deps.STORAGE_KEY_ADVANCED_PRESETS, []);
        const rollbackPresets = Array.isArray(storedBefore) ? [...storedBefore] : [];
        try {
          _lastImportError = '';
          const parseResult = deps.parseAdvancedPresetText(jsonStr);
          // 生成新ID避免冲突
          const imported = {
            ...parseResult.preset,
            id: 'imported_' + Date.now(),
            kind: 'advanced' as const,
            builtin: false,
            visible: true,
            version: PRESET_FORMAT_VERSION,
            createdAt: new Date().toISOString(),
          };

          const result = this.createPreset(imported);
          if (result && parseResult.needsUpdate) {
            console.warn(
              `[DICE]AdvancedDicePresetManager 导入的预设 "${result.name}" 版本较旧 (${parseResult.importedVersion})，已自动更新到 ${PRESET_FORMAT_VERSION}`,
            );
          }
          if (parseResult.tests.length > 0 || parseResult.notes.length > 0) {
            console.info('[DICE]AdvancedDicePresetManager 已校验 AI/Agent 预设文档', {
              presetName: result?.name,
              sourceFormat: parseResult.sourceFormat,
              testCount: parseResult.tests.length,
              notes: parseResult.notes,
            });
          }
          return result;
        } catch (e) {
          Store.set(deps.STORAGE_KEY_ADVANCED_PRESETS, rollbackPresets);
          _cache = null;
          _lastImportError = deps.getAdvancedPresetErrorMessage(e);
          console.error('[DICE]AdvancedDicePresetManager 导入失败:', e);
          return null;
        }
      },

      getLastImportError() {
        return _lastImportError;
      },

      // 清除缓存
      clearCache() {
        _cache = null;
      },

      /**
       * 检查预设是否支持对抗检定
       * @param preset 预设对象或预设ID
       * @returns true 表示支持对抗检定，false 表示不支持
       */
      supportsContest(preset: AdvancedDicePreset | string | null | undefined): boolean {
        if (!preset) return true; // 无预设时（自定义模式）默认支持

        const presetObj = typeof preset === 'string' ? this.getAllPresets().find(p => p.id === preset) : preset;
        if (!presetObj) return true; // 找不到预设时默认支持

        // 检查 contestRule.disabled 标志
        return !(presetObj.contestRule?.disabled === true);
      },
    };
  })();
  return AdvancedDicePresetManager;
}
