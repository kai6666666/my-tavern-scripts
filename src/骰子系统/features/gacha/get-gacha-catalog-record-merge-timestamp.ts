// @ts-nocheck
/**
 * get-gacha-catalog-record-merge-timestamp.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaCatalogRecord } from './gacha-types';
export function createGetGachaCatalogRecordMergeTimestamp(deps: any) {
  const getGachaCatalogRecordMergeTimestamp = (record: GachaCatalogRecord): number =>
    Math.max(
      Number(record.updatedAt) || 0,
      ...record.items.map(item => deps.getGachaCatalogItemMergeTimestamp(item)),
    );
  return getGachaCatalogRecordMergeTimestamp;
}
