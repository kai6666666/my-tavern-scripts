// @ts-nocheck
/**
 * get-gacha-item-definition-fingerprint.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaItemDefinition } from '../../entities/gacha-items';
export function createGetGachaItemDefinitionFingerprint(deps: any) {
  const getGachaItemDefinitionFingerprint = (item: GachaItemDefinition | null | undefined): string => {
    if (!item) return '';
    const comparable = {
      id: item.id,
      name: item.name,
      type: item.type,
      quality: item.quality,
      tags: item.tags || '',
      effect: item.effect || '',
      description: item.description,
      poolTags: [...(item.poolTags || [])].sort(),
      icon: item.icon || '',
      weight: Number(item.weight || 0),
      stackable: item.stackable === true,
      unique: item.unique === true,
      grantQuantity: Number(item.grantQuantity || 0),
      rewardTarget: item.rewardTarget || 'inventory',
      targetTable: item.targetTable || '',
      targetColumns: item.targetColumns || null,
      customFields: item.customFields || null,
      createdAt: item.createdAt || '',
      updatedAt: item.updatedAt || '',
    };
    return JSON.stringify(comparable);
  };
  return getGachaItemDefinitionFingerprint;
}
