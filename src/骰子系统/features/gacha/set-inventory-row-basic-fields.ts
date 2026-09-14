// @ts-nocheck
/**
 * set-inventory-row-basic-fields.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaItemDefinition } from '../../entities/gacha-items';
export function createSetInventoryRowBasicFields(deps: any) {
  const setInventoryRowBasicFields = (row: unknown[], colMap, item: GachaItemDefinition, quantity: number) => {
    if (colMap.name >= 0) row[colMap.name] = item.name;
    if (colMap.type >= 0) row[colMap.type] = item.type;
    if (colMap.quantity >= 0) row[colMap.quantity] = String(quantity);
    if (colMap.quality >= 0) row[colMap.quality] = item.quality;
    if (typeof colMap.tags === 'number' && colMap.tags >= 0) row[colMap.tags] = deps.getGachaItemTagsText(item);
    if (typeof colMap.effect === 'number' && colMap.effect >= 0) row[colMap.effect] = deps.getGachaItemEffectText(item);
    if (colMap.description >= 0) row[colMap.description] = deps.getGachaItemDescriptionText(item);
  };
  return setInventoryRowBasicFields;
}
