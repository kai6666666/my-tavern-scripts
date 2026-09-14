// @ts-nocheck
/**
 * serialize-gacha-catalog-item-for-export.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaItemDefinition } from '../../entities/gacha-items';
export function createSerializeGachaCatalogItemForExport(deps: any) {
  const serializeGachaCatalogItemForExport = (item: GachaItemDefinition): GachaItemDefinition => {
    const exported: GachaItemDefinition = {
      id: item.id,
      name: item.name,
      type: item.type,
      quality: item.quality,
      ...(item.tags ? { tags: item.tags } : {}),
      ...(item.effect ? { effect: item.effect } : {}),
      description: item.description,
      poolTags: [...item.poolTags],
      enabled: deps.isGachaItemEnabled(item),
      order: deps.normalizeGachaItemOrder(item.order),
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      weight: item.weight,
      stackable: item.stackable,
      unique: item.unique,
      grantQuantity: item.grantQuantity,
      rewardTarget: item.rewardTarget,
    };
    const targetTable = deps.normalizeGachaTargetTable(item.targetTable);
    if (targetTable) exported.targetTable = targetTable;
    const targetColumns = deps.normalizeGachaTargetColumns(item.targetColumns);
    if (targetColumns) exported.targetColumns = targetColumns;
    if (item.icon) exported.icon = item.icon;
    const customFields = deps.normalizeGachaCustomFields(item.customFields);
    if (customFields) exported.customFields = customFields;
    return exported;
  };
  return serializeGachaCatalogItemForExport;
}
