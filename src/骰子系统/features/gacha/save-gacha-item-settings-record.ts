// @ts-nocheck
/**
 * save-gacha-item-settings-record.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { STORAGE_KEY_GACHA_ITEM_SETTINGS } from '../../shared/storage-keys';
import { Store } from '../../shared/storage/store';
import type { GachaItemSettingsEntry, GachaItemSettingsRecord } from './gacha-types';
export function createSaveGachaItemSettingsRecord(deps: any) {
  const saveGachaItemSettingsRecord = (items: Record<string, GachaItemSettingsEntry>) => {
    const saved = Store.set(STORAGE_KEY_GACHA_ITEM_SETTINGS, {
      version: 1,
      items,
      updatedAt: Date.now(),
    } satisfies GachaItemSettingsRecord);
    if (!saved) throw new Error('自定义物品设置保存失败');
  };
  return saveGachaItemSettingsRecord;
}
