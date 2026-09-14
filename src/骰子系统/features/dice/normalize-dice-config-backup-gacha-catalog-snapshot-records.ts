// @ts-nocheck
/**
 * normalize-dice-config-backup-gacha-catalog-snapshot-records.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaCatalogRecord } from '../gacha/gacha-types';
export function createNormalizeDiceConfigBackupGachaCatalogSnapshotRecords(deps: any) {
  const normalizeDiceConfigBackupGachaCatalogSnapshotRecords = (
    records: readonly GachaCatalogRecord[],
  ): GachaCatalogRecord[] =>
    records
      .map(record => {
        const scopeKey = String(record.scopeKey || '').trim();
        const catalog = deps.normalizeGachaCatalogRecord(record);
        if (!scopeKey || !catalog) return null;
        return {
          scopeKey,
          version: catalog.version,
          items: deps.cloneGachaCatalogItems(catalog.items),
          updatedAt: catalog.updatedAt,
        } satisfies GachaCatalogRecord;
      })
      .filter((record): record is GachaCatalogRecord => Boolean(record));
  return normalizeDiceConfigBackupGachaCatalogSnapshotRecords;
}
