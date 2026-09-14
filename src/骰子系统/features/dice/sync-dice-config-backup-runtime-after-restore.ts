// @ts-nocheck
/**
 * sync-dice-config-backup-runtime-after-restore.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { Store } from '../../shared/storage/store';
import { setDatabaseToastMute } from '../../shared/database-toast-mute';
export function createSyncDiceConfigBackupRuntimeAfterRestore(deps: any) {
  const syncDiceConfigBackupRuntimeAfterRestore = (
    restoredModuleIds: readonly DiceConfigBackupModuleId[],
    options: { closeSettings?: boolean } = {},
  ): void => {
    deps.set_configCache(null);
    deps.PresetManager.clearCache();
    deps.ValidationRuleManager.clearCache();
    deps.RegexPresetManager.clearCache();
    deps.RegexTransformationManager.clearCache();
    deps.AttributePresetManager.clearCache();
    deps.AdvancedDicePresetManager.clearCache();
    deps.ActionPresetManager.clearCache();
    deps.DashboardPresetManager.clearCache();
    deps.RenderPresetManager.clearCache();
    deps.TableTemplateRequirementPresetManager.clearCache();
    deps.AvatarManager._cache = null;
    deps.setDashboardRuntimeConfigCache(null);
    if (restoredModuleIds.includes('gachaSettings')) {
      deps.setGachaCatalogCache(null);
      deps.setGachaCatalogLoadTask(null);
      deps.refreshGachaVisualization();
      deps.refreshGachaShardShop();
      const { $ } = deps.getCore();
      if ($('.acu-gacha-settings-overlay').length) void deps.showGachaSettingsDialog();
    }

    if (restoredModuleIds.includes('regex')) {
      const activeRegexPreset = deps.RegexPresetManager.getActivePreset();
      if (activeRegexPreset) {
        if (!Store.set(deps.STORAGE_KEY_REGEX_RULES, deps.cloneDiceConfigBackupValue(activeRegexPreset.rules || []))) {
          throw new Error('正则规则同步保存失败');
        }
        deps.RegexTransformationManager.clearCache();
      }
    }

    const config = deps.getConfig();
    deps.applyConfigStyles(config);
    setDatabaseToastMute(config.muteDatabaseToasts === true);
    deps.refreshDicePanelPresets();

    if (options.closeSettings) {
      const { $ } = deps.getCore();
      $('.acu-edit-overlay')
        .filter((_, element) => $(element).find('.acu-settings-dialog').length > 0)
        .remove();
      deps.setIsSettingsOpen(false);
      deps.renderInterface();
    } else if (!deps.getIsSettingsOpen()) {
      deps.renderInterface();
    }
  };
  return syncDiceConfigBackupRuntimeAfterRestore;
}
