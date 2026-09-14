// @ts-nocheck
/**
 * dismantle-inventory-item.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { GACHA_SHARD_VALUES } from '../../entities/gacha-items';
export function createDismantleInventoryItem(deps: any) {
  const dismantleInventoryItem = async (rowIndex: number) => {
    try {
      await deps.runInSaveQueue(async () => {
        const context = deps.getInventoryDetailContext(rowIndex, { preferLatest: true });
        if (!context) {
          if (window.toastr) window.toastr.warning('未找到可拆解的物品');
          return;
        }

        const rarity = String(context.item.quality || '').trim();
        if (!deps.isGachaRarity(rarity)) {
          if (window.toastr) window.toastr.warning('当前物品品质不支持拆解');
          return;
        }

        const quantityAvailable = Math.max(1, Number.parseInt(String(context.item.quantity || 1), 10) || 1);
        const definition = deps.findGachaDefinitionByInventoryItem(context.item, context.rawData);
        const dismantleUnitSize = definition ? deps.getGachaItemGrantQuantity(definition) : 1;
        const maxDismantleUnits = Math.floor(quantityAvailable / dismantleUnitSize);
        if (maxDismantleUnits <= 0) {
          if (window.toastr)
            window.toastr.warning(`至少需要 ${dismantleUnitSize} 个${context.item.name}才能拆解为碎片`);
          return;
        }

        let dismantleUnits = 1;
        if (maxDismantleUnits > 1) {
          const unitLabel = dismantleUnitSize > 1 ? `组（每组 ${dismantleUnitSize} 个）` : '个';
          const input = await deps.showDiceSystemInputDialog({
            title: '拆解数量',
            message: `请输入要拆解的${unitLabel}数量（1-${maxDismantleUnits}）`,
            iconClass: 'fa-cubes-stacked',
            initialValue: String(maxDismantleUnits),
            inputMode: 'numeric',
            confirmText: '继续拆解',
          });
          if (input === null) return;
          dismantleUnits = Number.parseInt(String(input || '').trim(), 10);
          if (!Number.isFinite(dismantleUnits) || dismantleUnits <= 0 || dismantleUnits > maxDismantleUnits) {
            if (window.toastr) window.toastr.warning('拆解数量不合法');
            return;
          }
        }
        const dismantleQuantity = dismantleUnits * dismantleUnitSize;

        const state = deps.touchGachaActivity(deps.getGachaState(context.rawData, true));
        if (!state) return;
        const shardGain = deps.addGachaShards(state, rarity, GACHA_SHARD_VALUES[rarity] * dismantleUnits);
        const nextQuantity = quantityAvailable - dismantleQuantity;

        if (nextQuantity <= 0) {
          context.rawData[context.item.tableKey].content.splice(context.item.rowIndex + 1, 1);
        } else if (context.colMap.quantity >= 0) {
          context.row[context.colMap.quantity] = String(nextQuantity);
        }

        await deps.persistRawDataWithGacha(context.rawData, [context.item.tableKey], state);
        $('.acu-inventory-detail-overlay').remove();
        deps.refreshGachaVisualization();
        deps.refreshInventoryVisualization();
        if (window.toastr) {
          window.toastr.success(
            `已拆解 ${context.item.name}${dismantleQuantity > 1 ? ` ×${dismantleQuantity}` : ''}，获得 ${shardGain}${deps.getGachaShardLabel(rarity)}`,
            '骰子商店',
          );
        }
      });
    } catch (error) {
      deps.showGachaSaveError(error, '拆解保存');
    }
  };
  return dismantleInventoryItem;
}
