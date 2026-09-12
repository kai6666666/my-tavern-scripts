// @ts-nocheck
/**
 * table-template-requirement-preset-manager.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { Store } from '../../shared/storage/store';
import { DEFAULT_TABLE_TEMPLATE_REQUIREMENT_PRESET_ID, cloneTemplateValue, exportTableTemplateRequirementPreset, normalizeTableTemplateRequirementPreset } from '../table/table-template-requirements';
export function createTableTemplateRequirementPresetManager(deps: any) {
  const TableTemplateRequirementPresetManager = (() => {
    let _cache = null;

    const getStoredPresets = () => {
      const stored = Store.get(deps.STORAGE_KEY_TABLE_TEMPLATE_REQUIREMENT_PRESETS, []);
      return Array.isArray(stored) ? stored : [];
    };

    const getBuiltinPresets = () => deps.BUILTIN_TABLE_TEMPLATE_REQUIREMENT_PRESETS.map(preset => cloneTemplateValue(preset));
    const getBuiltinPresetIds = () => new Set(deps.BUILTIN_TABLE_TEMPLATE_REQUIREMENT_PRESETS.map(preset => preset.id));

    const getCustomPresets = () => {
      const builtinIds = getBuiltinPresetIds();
      const customById = new Map();
      getStoredPresets().forEach((preset, index) => {
        if (!deps.isDiceConfigBackupRecord(preset)) return;
        const id = deps.getDiceConfigBackupPresetRecordId(preset);
        if (!id || preset.builtin === true || builtinIds.has(id)) return;
        const normalized = normalizeTableTemplateRequirementPreset(preset, id);
        if (!normalized || normalized.builtin === true) return;
        customById.set(id, {
          ...normalized,
          id,
          builtin: false,
          order: Number.isFinite(Number(normalized.order)) ? Number(normalized.order) : 1000 + index,
        });
      });
      return Array.from(customById.values());
    };

    const saveCustomPresets = presets => {
      Store.set(
        deps.STORAGE_KEY_TABLE_TEMPLATE_REQUIREMENT_PRESETS,
        presets
          .filter(preset => preset && preset.builtin !== true && !getBuiltinPresetIds().has(preset.id))
          .map(preset => ({
            ...preset,
            builtin: false,
          })),
      );
      _cache = null;
    };

    const getUniqueId = (prefix = 'custom_table_template_requirement') => {
      const existing = new Set([...getBuiltinPresets(), ...getCustomPresets()].map(preset => preset.id));
      let id = `${prefix}_${Date.now()}`;
      let index = 2;
      while (existing.has(id)) {
        id = `${prefix}_${Date.now()}_${index}`;
        index += 1;
      }
      return id;
    };

    const sortPresets = presets =>
      presets.sort((left, right) => {
        const orderDiff = Number(left.order || 999) - Number(right.order || 999);
        if (orderDiff !== 0) return orderDiff;
        return String(left.name || '').localeCompare(String(right.name || ''));
      });

    return {
      getAllPresets() {
        if (_cache) return _cache;
        _cache = sortPresets([...getBuiltinPresets(), ...getCustomPresets()]);
        return _cache;
      },

      getPresetById(id) {
        return this.getAllPresets().find(preset => preset.id === id) || null;
      },

      getActivePresetId() {
        const storedId = Store.get(
          deps.STORAGE_KEY_ACTIVE_TABLE_TEMPLATE_REQUIREMENT_PRESET,
          DEFAULT_TABLE_TEMPLATE_REQUIREMENT_PRESET_ID,
        );
        return this.getPresetById(storedId) ? storedId : DEFAULT_TABLE_TEMPLATE_REQUIREMENT_PRESET_ID;
      },

      getActivePreset() {
        return this.getPresetById(this.getActivePresetId()) || deps.BUILTIN_TABLE_TEMPLATE_REQUIREMENT_PRESETS[0];
      },

      clearCache() {
        _cache = null;
      },

      setActivePresetId(id) {
        const preset = this.getPresetById(id);
        if (!preset) return false;
        Store.set(deps.STORAGE_KEY_ACTIVE_TABLE_TEMPLATE_REQUIREMENT_PRESET, preset.id);
        _cache = null;
        return true;
      },

      createPreset(input) {
        const normalized = normalizeTableTemplateRequirementPreset(input, getUniqueId());
        if (!normalized) return null;
        const customPresets = getCustomPresets();
        const preset = {
          ...normalized,
          id: getUniqueId(),
          builtin: false,
          order: customPresets.length > 0 ? Math.max(...customPresets.map(item => Number(item.order || 1000))) + 1 : 1000,
          createdAt: new Date().toISOString(),
        };
        saveCustomPresets([...customPresets, preset]);
        return preset;
      },

      updatePreset(id, input) {
        if (deps.BUILTIN_TABLE_TEMPLATE_REQUIREMENT_PRESETS.some(preset => preset.id === id)) {
          throw new Error('内置模板检验预设不能直接修改，请先复制为自定义预设。');
        }
        const customPresets = getCustomPresets();
        const index = customPresets.findIndex(preset => preset.id === id);
        if (index < 0) return false;
        const normalized = normalizeTableTemplateRequirementPreset(input, id);
        if (!normalized) return false;
        customPresets[index] = {
          ...customPresets[index],
          ...normalized,
          id,
          builtin: false,
          updatedAt: new Date().toISOString(),
        };
        saveCustomPresets(customPresets);
        return true;
      },

      deletePreset(id) {
        if (deps.BUILTIN_TABLE_TEMPLATE_REQUIREMENT_PRESETS.some(preset => preset.id === id)) {
          throw new Error('内置模板检验预设不能删除。');
        }
        const customPresets = getCustomPresets();
        const nextPresets = customPresets.filter(preset => preset.id !== id);
        if (nextPresets.length === customPresets.length) return false;
        saveCustomPresets(nextPresets);
        if (Store.get(deps.STORAGE_KEY_ACTIVE_TABLE_TEMPLATE_REQUIREMENT_PRESET) === id) {
          Store.set(deps.STORAGE_KEY_ACTIVE_TABLE_TEMPLATE_REQUIREMENT_PRESET, DEFAULT_TABLE_TEMPLATE_REQUIREMENT_PRESET_ID);
        }
        return true;
      },

      exportPreset(id) {
        const preset = this.getPresetById(id);
        return preset ? exportTableTemplateRequirementPreset(preset) : null;
      },

      importPreset(jsonText) {
        const parsed = deps.parseTableTemplateRequirementPresetJson(jsonText);
        const normalized = normalizeTableTemplateRequirementPreset(parsed, getUniqueId('imported_table_template_requirement'));
        if (!normalized) return null;
        return this.createPreset({
          ...normalized,
          id: getUniqueId('imported_table_template_requirement'),
          builtin: false,
        });
      },
    };
  })();
  return TableTemplateRequirementPresetManager;
}
