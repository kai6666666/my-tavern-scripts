// @ts-nocheck
/**
 * exchange-gacha-shard-item.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createExchangeGachaShardItem(deps: any) {
  const exchangeGachaShardItem = async (itemId: string) => {
    try {
      await deps.runInSaveQueue(async () => {
        const rawData = deps.getTableData({ silent: true }) || deps.getCachedRawData();
        if (!rawData) return;
        await deps.ensureGachaCatalogLoaded(rawData);
        const item = deps.getAllGachaItemDefinitions(rawData).find(definition => definition.id === itemId);
        if (!item) return;
        if (!deps.isGachaItemEnabled(item)) {
          if (window.toastr) window.toastr.warning('这个物品已禁用，暂时无法兑换');
          return;
        }
        if (!deps.hasGachaRewardTableForItem(rawData, item)) {
          deps.warnTableTemplateIssue(
            `未找到${deps.formatGachaRewardDestinationLabel(rawData, item)}，暂时无法兑换。请检查该物品的 targetTable 或当前仪表盘预设。`,
          );
          return;
        }
        const state = deps.touchGachaActivity(deps.getGachaState(rawData, true));
        if (!state) return;
        const ownedBlocked = deps.isGachaItemOwned(rawData, item) && (item.unique || !item.stackable);
        if (ownedBlocked) {
          if (window.toastr)
            window.toastr.warning(
              `这个物品已在${deps.formatGachaRewardDestinationLabel(rawData, item)}中拥有，不能重复兑换`,
            );
          return;
        }
        const balance = Math.max(0, Math.floor(Number(state.wallet.shards[item.quality] || 0)));
        if (balance < deps.GACHA_SHARD_EXCHANGE_COST) {
          if (window.toastr) window.toastr.warning(`${deps.getGachaShardLabel(item.quality)}不足`);
          return;
        }
        state.wallet.shards[item.quality] = balance - deps.GACHA_SHARD_EXCHANGE_COST;
        let result: { outcome: GachaDrawOutcome; modifiedSheetKey?: string } | null;
        try {
          result = deps.grantGachaReward(rawData, state, item, 1);
        } catch (error) {
          state.wallet.shards[item.quality] = balance;
          throw error;
        }
        if (!result || result.outcome.duplicateConverted) {
          state.wallet.shards[item.quality] = balance;
          if (window.toastr) window.toastr.warning('兑换失败，碎片已退回');
          return;
        }
        await deps.persistRawDataWithGacha(rawData, result.modifiedSheetKey ? [result.modifiedSheetKey] : undefined, state);
        deps.refreshGachaVisualization();
        deps.refreshGachaShardShop();
        deps.refreshInventoryVisualization();
        if (window.toastr) window.toastr.success(`已兑换 ${item.name}`, '碎片商城');
      });
    } catch (error) {
      deps.showGachaSaveError(error, '碎片兑换保存');
    }
  };
  return exchangeGachaShardItem;
}
