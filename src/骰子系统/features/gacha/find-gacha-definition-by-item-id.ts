// @ts-nocheck
/**
 * find-gacha-definition-by-item-id.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaItemDefinition } from '../../entities/gacha-items';
export function createFindGachaDefinitionByItemId(deps: any) {
  const findGachaDefinitionByItemId = (
    itemId: string,
    rawData = deps.getRuntimeGachaRawData(),
  ): GachaItemDefinition | null => {
    const normalizedItemId = String(itemId || '').trim();
    if (!normalizedItemId) return null;
    return deps.getAllGachaItemDefinitions(rawData).find(definition => definition.id === normalizedItemId) || null;
  };
  return findGachaDefinitionByItemId;
}
