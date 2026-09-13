// @ts-nocheck
/**
 * clear-global-gacha-catalog.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { STORAGE_KEY_GACHA_ITEM_SETTINGS } from '../../shared/storage-keys';
export function createClearGlobalGachaCatalog(deps: any) {
  const clearGlobalGachaCatalog = async () => {
    await deps.runInSaveQueue(async () => {
      const rawData = deps.getRuntimeGachaRawData();
      await deps.ensureGachaCatalogLoaded(rawData);
      const originalItems = deps.cloneGachaCatalogItems(deps.getCustomGachaItemDefinitions(rawData));
      const localStorageSnapshot = deps.collectGachaLocalStorageSnapshot([STORAGE_KEY_GACHA_ITEM_SETTINGS]);
      const customIds = deps.getCustomGachaItemDefinitions(rawData).map(item => item.id);
      const count = customIds.length;
      const savedCatalog = await deps.saveStoredGachaCatalog([]);
      if (!savedCatalog) throw new Error('自定义物品清空失败');
      try {
        customIds.forEach(deps.deleteGachaItemSetting);
      } catch (error) {
        const rolledBackCatalog = await deps.saveStoredGachaCatalog(originalItems);
        const rollbackWarnings = deps.restoreGachaLocalStorageSnapshot(localStorageSnapshot);
        const message = deps.getRuntimeErrorMessage(error) || '清空自定义物品设置失败';
        const rollbackMessage = [
          !rolledBackCatalog ? '自定义物品目录回滚失败' : '',
          ...rollbackWarnings,
        ].filter(Boolean).join('；');
        if (rollbackMessage) throw new Error(`${message}；${rollbackMessage}`);
        throw error;
      }
      deps.refreshGachaVisualization();
      deps.refreshGachaShardShop();
      if ($('.acu-gacha-settings-overlay').length) void deps.showGachaSettingsDialog();
      if (window.toastr) window.toastr.success(`已清空全局目录的 ${count} 个自定义物品`);
    });
  };
  return clearGlobalGachaCatalog;
}
