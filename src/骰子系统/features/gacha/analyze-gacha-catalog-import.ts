// @ts-nocheck
/**
 * analyze-gacha-catalog-import.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaCatalogImportAnalysis, NormalizedGachaCatalogItem } from '../../features/gacha/gacha-types';
export function createAnalyzeGachaCatalogImport(deps: any) {
  const analyzeGachaCatalogImport = (jsonString: string, rawData): GachaCatalogImportAnalysis | null => {
    let data: unknown;
    try {
      data = deps.parseJsoncValue(jsonString);
    } catch (error) {
      console.error('[DICE][GACHA]自定义物品卡池 JSON 解析失败:', error);
      return null;
    }
    const record = data && typeof data === 'object' ? (data as Record<string, unknown>) : {};
    const rawItems = Array.isArray(record.items) ? record.items : Array.isArray(data) ? data : [];
    if (!Array.isArray(rawItems)) return null;
    const importedPools = deps.normalizeImportedGachaPools(record.pools);

    const errors: string[] = [];
    const items = rawItems
      .map((item, index) => deps.normalizeImportedGachaItem(item, index, errors, importedPools.tagAliases))
      .filter((item): item is NormalizedGachaCatalogItem => Boolean(item));
    const existingIds = new Set(deps.getAllGachaItemDefinitions(rawData).map(item => item.id));
    const seenImportIds = new Set<string>();
    const duplicateIds = new Set<string>();
    items.forEach(item => {
      if (seenImportIds.has(item.id)) duplicateIds.add(item.id);
      seenImportIds.add(item.id);
    });
    const conflictIds = Array.from(
      new Set(items.map(item => item.id).filter(id => existingIds.has(id) || duplicateIds.has(id))),
    );
    return {
      items,
      pools: importedPools.pools,
      skipped: rawItems.length - items.length,
      errors,
      conflictIds,
    };
  };
  return analyzeGachaCatalogImport;
}
