// @ts-nocheck
/**
 * merge-gacha-catalog-records.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { GACHA_CATALOG_VERSION } from '../../entities/gacha-items';
export function createMergeGachaCatalogRecordsToGlobalScope(deps: any) {
  const mergeGachaCatalogRecordsToGlobalScope = (
    records: readonly GachaCatalogRecord[],
  ): GachaCatalogRecord | null => {
    const normalizedRecords = records
      .map(deps.normalizeScopedGachaCatalogRecord)
      .filter((record): record is GachaCatalogRecord => Boolean(record))
      .sort((a, b) => {
        const byTimestamp = deps.getGachaCatalogRecordMergeTimestamp(a) - deps.getGachaCatalogRecordMergeTimestamp(b);
        if (byTimestamp !== 0) return byTimestamp;
        if (a.scopeKey === deps.GACHA_CATALOG_GLOBAL_SCOPE_KEY && b.scopeKey !== deps.GACHA_CATALOG_GLOBAL_SCOPE_KEY) return 1;
        if (b.scopeKey === deps.GACHA_CATALOG_GLOBAL_SCOPE_KEY && a.scopeKey !== deps.GACHA_CATALOG_GLOBAL_SCOPE_KEY) return -1;
        return a.scopeKey.localeCompare(b.scopeKey);
      });
    if (normalizedRecords.length === 0) return null;

    const items: GachaItemDefinition[] = [];
    const itemIndexById = new Map<string, number>();
    const itemTimestampById = new Map<string, number>();
    let version = GACHA_CATALOG_VERSION;
    let updatedAt = 0;

    normalizedRecords.forEach(record => {
      version = Math.max(version, record.version || 1);
      updatedAt = Math.max(updatedAt, Number(record.updatedAt) || 0);
      record.items.forEach(item => {
        const id = String(item.id || '').trim();
        if (!id) return;
        const incoming: GachaItemDefinition = deps.cloneDiceConfigBackupValue({ ...item, id });
        const incomingTimestamp = deps.getGachaCatalogItemMergeTimestamp(incoming, record.updatedAt);
        const existingIndex = itemIndexById.get(id);
        if (existingIndex === undefined) {
          itemIndexById.set(id, items.length);
          itemTimestampById.set(id, incomingTimestamp);
          items.push(incoming);
          updatedAt = Math.max(updatedAt, incomingTimestamp);
          return;
        }

        const existing = items[existingIndex];
        const existingTimestamp =
          itemTimestampById.get(id) ?? deps.getGachaCatalogItemMergeTimestamp(existing, updatedAt);
        if (incomingTimestamp >= existingTimestamp) {
          items[existingIndex] = {
            ...existing,
            ...incoming,
            id,
            createdAt: existing.createdAt || incoming.createdAt,
            updatedAt: incoming.updatedAt || existing.updatedAt,
          };
          itemTimestampById.set(id, incomingTimestamp);
          updatedAt = Math.max(updatedAt, incomingTimestamp);
        }
      });
    });

    return {
      scopeKey: deps.GACHA_CATALOG_GLOBAL_SCOPE_KEY,
      version,
      items,
      updatedAt,
    };
  };
  return mergeGachaCatalogRecordsToGlobalScope;
}
