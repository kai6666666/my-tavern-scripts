// @ts-nocheck
/**
 * format-gacha-catalog-import-stats-text.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaCatalogImportStats } from './gacha-types';
export function createFormatGachaCatalogImportStatsText(deps: any) {
  const formatGachaCatalogImportStatsText = (stats: GachaCatalogImportStats): string =>
    `新增 ${stats.added}，更新 ${stats.updated}，重命名 ${stats.renamed}，跳过 ${stats.skipped}${
      stats.warnings.length > 0 ? `，提示 ${stats.warnings.length}` : ''
    }`;
  return formatGachaCatalogImportStatsText;
}
