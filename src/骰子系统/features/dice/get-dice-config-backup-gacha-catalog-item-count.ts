// @ts-nocheck
/**
 * get-dice-config-backup-gacha-catalog-item-count.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaCatalogRecord } from '../gacha/gacha-types';
export function createGetDiceConfigBackupGachaCatalogItemCount(deps: any) {
  const getDiceConfigBackupGachaCatalogItemCount = (records: readonly GachaCatalogRecord[]): number =>
    records.reduce((count, record) => count + (Array.isArray(record.items) ? record.items.length : 0), 0);
  return getDiceConfigBackupGachaCatalogItemCount;
}
