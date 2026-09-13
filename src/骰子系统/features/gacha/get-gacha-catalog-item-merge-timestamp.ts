// @ts-nocheck
/**
 * get-gacha-catalog-item-merge-timestamp.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaItemDefinition } from '../../entities/gacha-items';
export function createGetGachaCatalogItemMergeTimestamp(deps: any) {
  const getGachaCatalogItemMergeTimestamp = (item: GachaItemDefinition, fallback = 0): number =>
    Math.max(0, Number(item.updatedAt) || 0, Number(item.createdAt) || 0, Number(fallback) || 0);
  return getGachaCatalogItemMergeTimestamp;
}
