// @ts-nocheck
/**
 * normalize-scoped-gacha-catalog-record.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaCatalogRecord } from './gacha-types';
export function createNormalizeScopedGachaCatalogRecord(deps: any) {
  const normalizeScopedGachaCatalogRecord = (recordRaw: unknown): GachaCatalogRecord | null => {
    if (!recordRaw || typeof recordRaw !== 'object') return null;
    const scopeKey = String((recordRaw as Record<string, unknown>).scopeKey || '').trim();
    const catalog = deps.normalizeGachaCatalogRecord(recordRaw);
    if (!scopeKey || !catalog) return null;
    return {
      scopeKey,
      version: catalog.version,
      items: deps.cloneGachaCatalogItems(catalog.items),
      updatedAt: catalog.updatedAt,
    };
  };
  return normalizeScopedGachaCatalogRecord;
}
