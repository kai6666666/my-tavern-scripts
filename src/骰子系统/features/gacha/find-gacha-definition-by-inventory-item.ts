// @ts-nocheck
/**
 * find-gacha-definition-by-inventory-item.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaItemDefinition } from '../../entities/gacha-items';
export function createFindGachaDefinitionByInventoryItem(deps: any) {
  const findGachaDefinitionByInventoryItem = (
    item: Pick<InventoryParsedItem, 'name' | 'quality'>,
    rawData = deps.getRuntimeGachaRawData(),
  ): GachaItemDefinition | null => deps.findGachaDefinitionByNameQuality(item.name, item.quality, rawData);
  return findGachaDefinitionByInventoryItem;
}
