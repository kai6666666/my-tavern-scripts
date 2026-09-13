// @ts-nocheck
/**
 * remove-acu-dice-gacha-custom-item.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { GACHA_ITEM_DEFINITIONS } from '../../entities/gacha-items';
export function createRemoveAcuDiceGachaCustomItem(deps: any) {
  const removeAcuDiceGachaCustomItem = async (itemId: unknown, options: { silent?: boolean } = {}) => {
    const id = String(itemId || '').trim();
    if (!id) throw new Error('[AcuDice][Gacha] removeCustomItem() 需要物品 id');
    let result: { removed: boolean; item: ReturnType<typeof deps.serializeAcuDiceGachaItem> | null } | null = null;

    await deps.runInSaveQueue(async () => {
      const rawData = deps.getRuntimeGachaRawData();
      await deps.ensureGachaCatalogLoaded(rawData);
      const customItems = deps.getCustomGachaItemDefinitions(rawData);
      const item = customItems.find(candidate => candidate.id === id) || null;
      if (!item) {
        if (GACHA_ITEM_DEFINITIONS.some(candidate => candidate.id === id)) {
          throw new Error('内置物品不能通过 API 删除，只能在商店设置里禁用');
        }
        result = { removed: false, item: null };
        return;
      }
      const nextItems = customItems.filter(candidate => candidate.id !== id);
      const saved = await deps.saveStoredGachaCatalog(nextItems);
      if (!saved) throw new Error('自定义物品删除保存失败');
      deps.deleteGachaItemSetting(id);
      deps.refreshGachaVisualization();
      deps.refreshGachaShardShop();
      if ($('.acu-gacha-settings-overlay').length) void deps.showGachaSettingsDialog();
      result = { removed: true, item: deps.serializeAcuDiceGachaItem(item, new Set([id])) };
    });

    if (!result) throw new Error('自定义物品删除失败');
    if (result.removed && !options.silent && window.toastr) window.toastr.success('自定义物品已删除', '骰子商店');
    deps.emitEvent('gacha:catalog', { action: 'removeCustomItem', ...result });
    return result;
  };
  return removeAcuDiceGachaCustomItem;
}
