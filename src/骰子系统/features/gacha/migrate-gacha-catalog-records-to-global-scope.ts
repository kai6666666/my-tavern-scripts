// @ts-nocheck
/**
 * migrate-gacha-catalog-records-to-global-scope.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { GachaCatalogDB } from './gacha-catalog-db';
import type { GachaCatalog, GachaCatalogRecord } from '../../features/gacha/gacha-types';
export function createMigrateGachaCatalogRecordsToGlobalScope(deps: any) {
  const migrateGachaCatalogRecordsToGlobalScope = async (): Promise<GachaCatalog> => {
    const records = await GachaCatalogDB.getAll();
    const normalizedRecords = records
      .map(deps.normalizeScopedGachaCatalogRecord)
      .filter((record): record is GachaCatalogRecord => Boolean(record));
    const mergedRecord = deps.mergeGachaCatalogRecordsToGlobalScope(normalizedRecords);
    if (!mergedRecord) return deps.createEmptyGachaCatalog();

    const needsMigration =
      normalizedRecords.length !== 1 || normalizedRecords[0]?.scopeKey !== deps.GACHA_CATALOG_GLOBAL_SCOPE_KEY;
    if (!needsMigration) {
      return {
        version: mergedRecord.version,
        items: deps.cloneGachaCatalogItems(mergedRecord.items),
        updatedAt: mergedRecord.updatedAt,
      };
    }

    const migratedRecord: GachaCatalogRecord = {
      ...mergedRecord,
      items: deps.cloneGachaCatalogItems(mergedRecord.items),
      updatedAt: Date.now(),
    };
    const replaced = await GachaCatalogDB.replaceAll([migratedRecord]);
    if (!replaced) throw new Error('自定义物品目录全局迁移失败');
    const legacyCount = normalizedRecords.filter(record => record.scopeKey !== deps.GACHA_CATALOG_GLOBAL_SCOPE_KEY).length;
    if (legacyCount > 0) {
      console.info(
        `[DICE][GACHA]已将 ${legacyCount} 个聊天自定义物品目录合并为全局目录，共 ${migratedRecord.items.length} 个物品。`,
      );
    }
    return {
      version: migratedRecord.version,
      items: deps.cloneGachaCatalogItems(migratedRecord.items),
      updatedAt: migratedRecord.updatedAt,
    };
  };
  return migrateGachaCatalogRecordsToGlobalScope;
}
