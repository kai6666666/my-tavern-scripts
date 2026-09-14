// @ts-nocheck
/**
 * normalize-dice-config-backup-gacha-item-settings.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaItemSettingsEntry, GachaItemSettingsRecord } from '../../features/gacha/gacha-types';
export function createNormalizeDiceConfigBackupGachaItemSettings(deps: any) {
  const normalizeDiceConfigBackupGachaItemSettings = (value: unknown): GachaItemSettingsRecord | null => {
    if (!deps.isDiceConfigBackupRecord(value)) return null;
    const rawItems = deps.isDiceConfigBackupRecord(value.items) ? value.items : {};
    const items: Record<string, GachaItemSettingsEntry> = {};
    Object.entries(rawItems).forEach(([rawId, rawEntry]) => {
      const id = String(rawId || '').trim();
      if (!id || !deps.isDiceConfigBackupRecord(rawEntry)) return;
      items[id] = {
        enabled: deps.normalizeGachaItemEnabled(rawEntry.enabled),
        order: deps.normalizeGachaItemOrder(rawEntry.order),
      };
    });
    return {
      version: Number(value.version) || 1,
      items,
      updatedAt: Math.max(0, Number(value.updatedAt) || 0),
    };
  };
  return normalizeDiceConfigBackupGachaItemSettings;
}
