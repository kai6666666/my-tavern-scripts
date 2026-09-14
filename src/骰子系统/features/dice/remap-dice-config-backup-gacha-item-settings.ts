// @ts-nocheck
/**
 * remap-dice-config-backup-gacha-item-settings.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { STORAGE_KEY_GACHA_ITEM_SETTINGS } from '../../shared/storage-keys';
import { Store } from '../../shared/storage/store';
import type { GachaItemSettingsRecord } from '../../features/gacha/gacha-types';
export function createRemapDiceConfigBackupGachaItemSettings(deps: any) {
  const remapDiceConfigBackupGachaItemSettings = (
    idMap: ReadonlyMap<string, string>,
    sourceIds: ReadonlySet<string>,
  ): boolean => {
    if (idMap.size === 0) return false;
    const currentRecord = deps.normalizeDiceConfigBackupGachaItemSettings(Store.get(STORAGE_KEY_GACHA_ITEM_SETTINGS, null));
    if (!currentRecord) return false;
    const items = { ...currentRecord.items };
    let changed = false;
    idMap.forEach((targetId, sourceId) => {
      if (!sourceIds.has(sourceId) || !sourceId || !targetId || sourceId === targetId || !items[sourceId]) return;
      items[targetId] = items[sourceId];
      delete items[sourceId];
      changed = true;
    });
    if (!changed) return false;
    if (!Store.set(STORAGE_KEY_GACHA_ITEM_SETTINGS, {
      version: Math.max(1, currentRecord.version),
      items,
      updatedAt: Date.now(),
    } satisfies GachaItemSettingsRecord)) {
      throw new Error('自定义物品设置映射保存失败');
    }
    return true;
  };
  return remapDiceConfigBackupGachaItemSettings;
}
