// @ts-nocheck
/**
 * get-gacha-settings-pool-items.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaItemDefinition, GachaPoolTag } from '../../entities/gacha-items';
export function createGetGachaSettingsPoolItems(deps: any) {
  const getGachaSettingsPoolItems = (rawData, poolId: GachaPoolTag): GachaItemDefinition[] =>
    deps.getGachaCatalogItemsForExport(rawData, poolId);
  return getGachaSettingsPoolItems;
}
