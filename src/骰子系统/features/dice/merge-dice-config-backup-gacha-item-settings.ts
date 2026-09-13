// @ts-nocheck
/**
 * merge-dice-config-backup-gacha-item-settings.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaItemSettingsRecord } from '../../features/gacha/gacha-types';
export function createMergeDiceConfigBackupGachaItemSettings(deps: any) {
  const mergeDiceConfigBackupGachaItemSettings = (
    current: unknown,
    incoming: unknown,
  ): GachaItemSettingsRecord | null => {
    const incomingRecord = deps.normalizeDiceConfigBackupGachaItemSettings(incoming);
    if (!incomingRecord) return null;
    const currentRecord = deps.normalizeDiceConfigBackupGachaItemSettings(current) || {
      version: 1,
      items: {},
      updatedAt: 0,
    };
    return {
      version: Math.max(1, incomingRecord.version, currentRecord.version),
      items: {
        ...currentRecord.items,
        ...incomingRecord.items,
      },
      updatedAt: Date.now(),
    };
  };
  return mergeDiceConfigBackupGachaItemSettings;
}
