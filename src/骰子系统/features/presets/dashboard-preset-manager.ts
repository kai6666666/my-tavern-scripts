// @ts-nocheck
/**
 * dashboard-preset-manager.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { PRESET_FORMAT_VERSION } from '../../shared/constants';
import { Store } from '../../shared/storage/store';
import { showActionableErrorToast } from '../../shared/actionable-error-toast';
export function createDashboardPresetManager(deps: any) {
  const DashboardPresetManager = (() => {
    let _cache: DashboardPreset[] | null = null;

    const getBuiltinPreset = (): DashboardPreset => deps.createBuiltinDashboardPreset();
    const getStoredPresets = (): DashboardPreset[] => Store.get(deps.STORAGE_KEY_DASHBOARD_PRESETS, []);
    const saveStoredPresets = (presets: DashboardPreset[]) => {
      Store.set(deps.STORAGE_KEY_DASHBOARD_PRESETS, presets);
      _cache = null;
      deps.setDashboardRuntimeConfigCache(null);
    };

    return {
      getAllPresets(): DashboardPreset[] {
        if (_cache) return _cache;
        _cache = [getBuiltinPreset(), ...getStoredPresets()];
        return _cache;
      },

      getPresetById(id: string): DashboardPreset | null {
        return this.getAllPresets().find(preset => preset.id === id) || null;
      },

      getActivePresetId(): string {
        const stored = Store.get(deps.STORAGE_KEY_ACTIVE_DASHBOARD_PRESET, deps.DASHBOARD_DEFAULT_PRESET_ID);
        if (typeof stored !== 'string' || !this.getPresetById(stored)) {
          Store.set(deps.STORAGE_KEY_ACTIVE_DASHBOARD_PRESET, deps.DASHBOARD_DEFAULT_PRESET_ID);
          return deps.DASHBOARD_DEFAULT_PRESET_ID;
        }
        return stored;
      },

      getActivePreset(): DashboardPreset {
        return this.getPresetById(this.getActivePresetId()) || getBuiltinPreset();
      },

      setActivePresetId(id: string): boolean {
        const preset = this.getPresetById(id);
        if (!preset) return false;
        Store.set(deps.STORAGE_KEY_ACTIVE_DASHBOARD_PRESET, id);
        deps.setDashboardRuntimeConfigCache(null);
        return true;
      },

      createPreset(preset: { name: string; description?: string; modules: DashboardPresetModules }): DashboardPreset {
        const stored = getStoredPresets();
        const newPreset: DashboardPreset = {
          format: deps.DASHBOARD_PRESET_FORMAT,
          version: PRESET_FORMAT_VERSION,
          id: `dashboard_${Date.now()}`,
          name: preset.name,
          description: preset.description || '',
          builtin: false,
          modules: deps.cloneDashboardPresetModules(preset.modules),
          createdAt: new Date().toISOString(),
        };
        stored.push(newPreset);
        saveStoredPresets(stored);
        return newPreset;
      },

      updatePreset(
        id: string,
        updates: { name: string; description?: string; modules: DashboardPresetModules },
      ): boolean {
        const stored = getStoredPresets();
        const index = stored.findIndex(preset => preset.id === id);
        if (index < 0) return false;
        stored[index] = {
          ...stored[index],
          name: updates.name,
          description: updates.description || '',
          modules: deps.cloneDashboardPresetModules(updates.modules),
          version: PRESET_FORMAT_VERSION,
          updatedAt: new Date().toISOString(),
        };
        saveStoredPresets(stored);
        return true;
      },

      deletePreset(id: string): boolean {
        if (id === deps.DASHBOARD_DEFAULT_PRESET_ID) return false;
        const stored = getStoredPresets();
        const filtered = stored.filter(preset => preset.id !== id);
        if (filtered.length === stored.length) return false;
        saveStoredPresets(filtered);
        if (this.getActivePresetId() === id) {
          this.setActivePresetId(deps.DASHBOARD_DEFAULT_PRESET_ID);
        }
        return true;
      },

      exportPreset(id: string): string | null {
        const preset = this.getPresetById(id);
        if (!preset) return null;
        const exported = {
          format: deps.DASHBOARD_PRESET_FORMAT,
          version: PRESET_FORMAT_VERSION,
          name: preset.name,
          description: preset.description || '',
          modules: deps.cloneDashboardPresetModules(preset.modules),
        };
        return JSON.stringify(exported, null, 2);
      },

      importPreset(jsonText: string): DashboardPreset | null {
        try {
          const parsed = deps.parseDashboardPresetJson(jsonText);
          return this.createPreset({
            name: parsed.name,
            description: parsed.description,
            modules: parsed.modules,
          });
        } catch (error) {
          console.error('[DICE]DashboardPresetManager 导入失败:', error);
          if (window.toastr)
            showActionableErrorToast('仪表盘预设导入失败: ' + (error instanceof Error ? error.message : String(error)), {
              suggestion: 'importExport',
            });
          return null;
        }
      },

      clearCache(): void {
        _cache = null;
        deps.setDashboardRuntimeConfigCache(null);
      },
    };
  })();
  return DashboardPresetManager;
}
