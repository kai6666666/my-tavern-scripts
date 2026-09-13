// @ts-nocheck
/**
 * get-stored-gacha-item-settings.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { STORAGE_KEY_GACHA_ITEM_SETTINGS } from '../../shared/storage-keys';
import { Store } from '../../shared/storage/store';
import type { GachaItemSettingsEntry, GachaItemSettingsRecord } from '../../features/gacha/gacha-types';
export function createGetStoredGachaItemSettings(deps: any) {
  const getStoredGachaItemSettings = (): GachaItemSettingsRecord => {
    const stored = Store.get(STORAGE_KEY_GACHA_ITEM_SETTINGS, null);
    const record = stored && typeof stored === 'object' ? (stored as Record<string, unknown>) : {};
    const rawItems =
      record.items && typeof record.items === 'object' && !Array.isArray(record.items)
        ? (record.items as Record<string, unknown>)
        : {};
    const items: Record<string, GachaItemSettingsEntry> = {};
    Object.entries(rawItems).forEach(([rawId, rawEntry]) => {
      const id = String(rawId || '').trim();
      if (!id || !rawEntry || typeof rawEntry !== 'object') return;
      const entry = rawEntry as Record<string, unknown>;
      items[id] = {
        enabled: deps.normalizeGachaItemEnabled(entry.enabled),
        order: deps.normalizeGachaItemOrder(entry.order),
      };
    });
    return {
      version: Number(record.version) || 1,
      items,
      updatedAt: Math.max(0, Number(record.updatedAt) || 0),
    };
  };
  return getStoredGachaItemSettings;
}
