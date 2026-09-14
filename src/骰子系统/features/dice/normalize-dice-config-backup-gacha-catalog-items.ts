// @ts-nocheck
/**
 * normalize-dice-config-backup-gacha-catalog-items.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createNormalizeDiceConfigBackupGachaCatalogItems(deps: any) {
  const normalizeDiceConfigBackupGachaCatalogItems = (
    rawItems: unknown,
    warnings: string[],
    scopeKey: string,
    rawData?: unknown,
  ): GachaItemDefinition[] => {
    if (!Array.isArray(rawItems)) {
      warnings.push(`骰子商城配置与自定义物品: ${scopeKey} 的自定义物品不是数组，已跳过。`);
      return [];
    }
    const errors: string[] = [];
    const items = rawItems
      .map((item, index) => deps.normalizeImportedGachaItem(item, index, errors, {}))
      .filter((item): item is NormalizedGachaCatalogItem => Boolean(item))
      .map(item => {
        const normalized: GachaItemDefinition = {
          id: item.id,
          name: item.name,
          type: item.type,
          quality: item.quality,
          ...(item.tags ? { tags: item.tags } : {}),
          ...(item.effect ? { effect: item.effect } : {}),
          description: item.description,
          poolTags: [...item.poolTags],
          icon: item.icon,
          enabled: deps.isGachaItemEnabled(item),
          order: item.order,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          weight: item.weight,
          stackable: item.stackable,
          unique: item.unique,
          grantQuantity: item.grantQuantity,
          rewardTarget: item.rewardTarget,
        };
        if (item.targetTable) normalized.targetTable = item.targetTable;
        if (item.targetColumns) normalized.targetColumns = item.targetColumns;
        if (item.customFields) normalized.customFields = item.customFields;
        return normalized;
      })
      .filter(item => (rawData === undefined ? true : deps.validateGachaCatalogImportItemTarget(rawData, item, warnings)));
    if (errors.length > 0) {
      warnings.push(`骰子商城配置与自定义物品: ${scopeKey} 有 ${errors.length} 条自定义物品无效，已跳过。`);
    }
    return items;
  };
  return normalizeDiceConfigBackupGachaCatalogItems;
}
