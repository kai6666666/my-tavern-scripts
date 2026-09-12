// @ts-nocheck
/**
 * render-preset-manager.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { PRESET_FORMAT_VERSION } from '../../shared/constants';
import { Store } from '../../shared/storage/store';
import { showActionableErrorToast } from '../../shared/actionable-error-toast';
export function createRenderPresetManager(deps: any) {
  const RenderPresetManager = (() => {
    let _cache: RenderPreset[] | null = null;

    const getBuiltinPreset = (): RenderPreset => deps.createBuiltinRenderPreset();
    const getStoredPresets = (): RenderPreset[] => Store.get(deps.STORAGE_KEY_RENDER_PRESETS, []);
    const saveStoredPresets = (presets: RenderPreset[]) => {
      Store.set(deps.STORAGE_KEY_RENDER_PRESETS, presets);
      _cache = null;
    };

    const normalizeStoredPreset = (preset: unknown): RenderPreset | null => {
      if (!deps.isRecordValue(preset)) return null;
      const id = typeof preset.id === 'string' ? preset.id.trim() : '';
      const name = typeof preset.name === 'string' ? preset.name.trim() : '';
      if (!id || !name) return null;
      return {
        format: deps.RENDER_PRESET_FORMAT,
        version: typeof preset.version === 'string' ? preset.version : PRESET_FORMAT_VERSION,
        id,
        name,
        builtin: preset.builtin === true,
        description: typeof preset.description === 'string' ? preset.description : '',
        rules: deps.normalizeRenderPresetRules(preset.rules),
        createdAt: typeof preset.createdAt === 'string' ? preset.createdAt : undefined,
        updatedAt: typeof preset.updatedAt === 'string' ? preset.updatedAt : undefined,
      };
    };

    const getNormalizedStoredPresets = (): RenderPreset[] =>
      getStoredPresets()
        .map(normalizeStoredPreset)
        .filter((preset): preset is RenderPreset => Boolean(preset))
        .map(preset => ({ ...preset, builtin: false }));

    const migrateLegacyBlacklistIfNeeded = (): void => {
      if (Store.get(deps.STORAGE_KEY_RENDER_PRESET_BLACKLIST_MIGRATED, false) === true) return;
      const legacy = Store.get(deps.STORAGE_KEY_BLACKLIST, null);
      Store.set(deps.STORAGE_KEY_RENDER_PRESET_BLACKLIST_MIGRATED, true);
      if (!Array.isArray(legacy)) return;

      const legacyList = deps.normalizeRenderPresetStringList(legacy);
      const sameAsDefault =
        deps.isSameKeywordSet(legacyList, deps.DEFAULT_QUICK_CHECK_EXCLUDE_KEYWORDS) ||
        deps.isSameKeywordSet(legacyList, deps.LEGACY_DEFAULT_QUICK_CHECK_EXCLUDE_KEYWORDS);
      if (sameAsDefault) return;

      const stored = getNormalizedStoredPresets();
      if (stored.some(preset => preset.id === deps.RENDER_LEGACY_BLACKLIST_PRESET_ID)) return;
      const shouldBackfillOverview =
        !legacyList.includes('概览') &&
        deps.LEGACY_DEFAULT_QUICK_CHECK_EXCLUDE_KEYWORDS.every(keyword => legacyList.includes(keyword));
      const migratedRules = deps.cloneRenderPresetRules(deps.DEFAULT_RENDER_PRESET_RULES);
      migratedRules.quickCheck.excludeKeywords = shouldBackfillOverview ? [...legacyList, '概览'] : legacyList;
      const migratedPreset: RenderPreset = {
        format: deps.RENDER_PRESET_FORMAT,
        version: PRESET_FORMAT_VERSION,
        id: deps.RENDER_LEGACY_BLACKLIST_PRESET_ID,
        name: '从变量过滤黑名单迁移',
        builtin: false,
        description: '自动迁移旧版变量过滤黑名单生成的渲染预设',
        rules: migratedRules,
        createdAt: new Date().toISOString(),
      };
      saveStoredPresets([...stored, migratedPreset]);
      Store.set(deps.STORAGE_KEY_ACTIVE_RENDER_PRESET, migratedPreset.id);
    };

    const getQuickCheckCompareName = (key: string): string => {
      const parts = key
        .split(/>| > /)
        .map(part => part.trim())
        .filter(Boolean);
      return parts.length > 0 ? parts[parts.length - 1] : key;
    };

    return {
      getAllPresets(): RenderPreset[] {
        migrateLegacyBlacklistIfNeeded();
        if (_cache) return _cache;
        _cache = [getBuiltinPreset(), ...getNormalizedStoredPresets()];
        return _cache;
      },

      getPresetById(id: string): RenderPreset | null {
        return this.getAllPresets().find(preset => preset.id === id) || null;
      },

      getActivePresetId(): string {
        const stored = Store.get(deps.STORAGE_KEY_ACTIVE_RENDER_PRESET, deps.RENDER_DEFAULT_PRESET_ID);
        if (typeof stored !== 'string' || !this.getPresetById(stored)) {
          Store.set(deps.STORAGE_KEY_ACTIVE_RENDER_PRESET, deps.RENDER_DEFAULT_PRESET_ID);
          return deps.RENDER_DEFAULT_PRESET_ID;
        }
        return stored;
      },

      getActivePreset(): RenderPreset {
        return this.getPresetById(this.getActivePresetId()) || getBuiltinPreset();
      },

      setActivePresetId(id: string): boolean {
        const preset = this.getPresetById(id);
        if (!preset) return false;
        Store.set(deps.STORAGE_KEY_ACTIVE_RENDER_PRESET, id);
        return true;
      },

      createPreset(preset: { name: string; description?: string; rules: RenderPresetRules }): RenderPreset {
        const stored = getNormalizedStoredPresets();
        const newPreset: RenderPreset = {
          format: deps.RENDER_PRESET_FORMAT,
          version: PRESET_FORMAT_VERSION,
          id: `render_${Date.now()}`,
          name: preset.name,
          description: preset.description || '',
          builtin: false,
          rules: deps.normalizeRenderPresetRules(preset.rules),
          createdAt: new Date().toISOString(),
        };
        saveStoredPresets([...stored, newPreset]);
        return newPreset;
      },

      updatePreset(id: string, updates: { name: string; description?: string; rules: RenderPresetRules }): boolean {
        const stored = getNormalizedStoredPresets();
        const index = stored.findIndex(preset => preset.id === id);
        if (index < 0) return false;
        stored[index] = {
          ...stored[index],
          name: updates.name,
          description: updates.description || '',
          rules: deps.normalizeRenderPresetRules(updates.rules),
          version: PRESET_FORMAT_VERSION,
          updatedAt: new Date().toISOString(),
        };
        saveStoredPresets(stored);
        return true;
      },

      deletePreset(id: string): boolean {
        if (id === deps.RENDER_DEFAULT_PRESET_ID) return false;
        const stored = getNormalizedStoredPresets();
        const filtered = stored.filter(preset => preset.id !== id);
        if (filtered.length === stored.length) return false;
        saveStoredPresets(filtered);
        if (this.getActivePresetId() === id) {
          this.setActivePresetId(deps.RENDER_DEFAULT_PRESET_ID);
        }
        return true;
      },

      exportPreset(id: string): string | null {
        const preset = this.getPresetById(id);
        if (!preset) return null;
        const exported = {
          format: deps.RENDER_PRESET_FORMAT,
          version: PRESET_FORMAT_VERSION,
          name: preset.name,
          description: preset.description || '',
          rules: deps.cloneRenderPresetRules(preset.rules),
        };
        return JSON.stringify(exported, null, 2);
      },

      importPreset(jsonText: string): RenderPreset | null {
        try {
          const parsed = deps.parseRenderPresetJson(jsonText);
          return this.createPreset({
            name: parsed.name,
            description: parsed.description,
            rules: parsed.rules,
          });
        } catch (error) {
          console.error('[DICE]RenderPresetManager 导入失败:', error);
          if (window.toastr)
            showActionableErrorToast('渲染预设导入失败: ' + deps.getJsonLikeErrorMessage(error), {
              suggestion: 'importExport',
            });
          return null;
        }
      },

      getColumnDisplayName(headerName: string): string {
        const preset = this.getActivePreset();
        const rawHeader = String(headerName || '').trim();
        const stripped = preset.rules.columnDisplay.stripBracketContent
          ? rawHeader.replace(/[\(（\[【][^)）\]】]*[\)）\]】]/g, '').trim()
          : rawHeader;
        return (
          preset.rules.columnDisplay.aliases[stripped] || preset.rules.columnDisplay.aliases[rawHeader] || stripped
        );
      },

      isInvalidValue(value: string): boolean {
        const lowered = String(value || '')
          .trim()
          .toLowerCase();
        if (!lowered) return false;
        return this.getActivePreset().rules.invalidValues.some(item => lowered === item.toLowerCase());
      },

      isIdentityHeader(headerName: string): boolean {
        const header = String(headerName || '').toLowerCase();
        return this.getActivePreset().rules.identityHeaderKeywords.some(keyword =>
          header.includes(keyword.toLowerCase()),
        );
      },

      isRelationshipCell(value: string, headerName: string): boolean {
        const rules = this.getActivePreset().rules.relationship;
        if (!rules.enabled) return false;
        const header = String(headerName || '').toLowerCase();
        if (rules.headerKeywords.some(keyword => header.includes(keyword.toLowerCase()))) return true;
        return (
          rules.autoDetectMultipleParen &&
          /^[^(（;；]+[(（][^)）]+[)）](?:[;；][^(（;；]+[(（][^)）]+[)）])+$/.test(String(value || '').trim())
        );
      },

      shouldShowQuickCheck(key: string): boolean {
        const rules = this.getActivePreset().rules.quickCheck;
        if (!rules.enabled) return false;
        const compareName = getQuickCheckCompareName(String(key || ''));
        if (!compareName) return false;
        return !rules.excludeKeywords.some(keyword => compareName.includes(keyword));
      },

      getDialogueIndentTagFilter(): RenderPresetDialogueIndentRules {
        const rules = this.getActivePreset().rules.dialogueIndent;
        return {
          whitelist: [...rules.whitelist],
          blacklist: [...rules.blacklist],
        };
      },

      clearCache(): void {
        _cache = null;
      },
    };
  })();
  return RenderPresetManager;
}
