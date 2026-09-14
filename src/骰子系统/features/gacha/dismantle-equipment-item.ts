// @ts-nocheck
/**
 * dismantle-equipment-item.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { GACHA_SHARD_VALUES } from '../../entities/gacha-items';
export function createDismantleEquipmentItem(deps: any) {
  const dismantleEquipmentItem = async (tableKey: string, rowIndex: number) => {
    try {
      await deps.runInSaveQueue(async () => {
        const rawData = deps.getTableData({ silent: true }) || deps.cloneRuntimeDataValue(deps.getCachedRawData());
        if (!rawData || !rawData[tableKey]) {
          if (window.toastr) window.toastr.warning('未找到可拆解的装备');
          return;
        }
        const parsed = deps.parseEquipmentItems(rawData);
        const item =
          parsed.items.find(candidate => candidate.tableKey === tableKey && candidate.rowIndex === rowIndex) ||
          parsed.items.find(candidate => candidate.rowIndex === rowIndex);
        if (!item) {
          if (window.toastr) window.toastr.warning('未找到可拆解的装备');
          return;
        }
        const rarity = String(item.quality || '').trim();
        if (!deps.isGachaRarity(rarity)) {
          if (window.toastr) window.toastr.warning('当前装备品质不支持拆解');
          return;
        }
        const state = deps.touchGachaActivity(deps.getGachaState(rawData, true));
        if (!state) return;
        const shardGain = deps.addGachaShards(state, rarity, GACHA_SHARD_VALUES[rarity] || 0);
        const table = rawData[item.tableKey];
        if (table && Array.isArray(table.content)) {
          table.content.splice(item.rowIndex + 1, 1);
        }
        await deps.persistRawDataWithGacha(rawData, [item.tableKey], state);
        $('.acu-preview-overlay').remove();
        deps.refreshGachaVisualization();
        deps.refreshInventoryVisualization();
        if (window.toastr) {
          window.toastr.success(`已拆解 ${item.name}，获得 ${shardGain}${deps.getGachaShardLabel(rarity)}`, '骰子商店');
        }
      });
    } catch (error) {
      deps.showGachaSaveError(error, '装备拆解保存');
    }
  };
  return dismantleEquipmentItem;
}
