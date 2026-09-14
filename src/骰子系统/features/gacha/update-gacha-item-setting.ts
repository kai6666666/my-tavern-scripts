// @ts-nocheck
/**
 * update-gacha-item-setting.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaItemSettingsEntry } from './gacha-types';
export function createUpdateGachaItemSetting(deps: any) {
  const updateGachaItemSetting = (itemId: string, updates: Partial<GachaItemSettingsEntry>): boolean => {
    const id = String(itemId || '').trim();
    if (!id) return false;
    const record = deps.getStoredGachaItemSettings();
    const existing = record.items[id] || { enabled: true, order: 999 };
    deps.saveGachaItemSettingsRecord({
      ...record.items,
      [id]: {
        enabled: updates.enabled !== undefined ? deps.normalizeGachaItemEnabled(updates.enabled) : existing.enabled,
        order: updates.order !== undefined ? deps.normalizeGachaItemOrder(updates.order) : existing.order,
      },
    });
    return true;
  };
  return updateGachaItemSetting;
}
