// @ts-nocheck
/**
 * get-gacha-pool-definitions.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaItemDefinition, GachaPoolTag } from '../../entities/gacha-items';
export function createGetGachaPoolDefinitions(deps: any) {
  const getGachaPoolDefinitions = (
    poolTag: GachaPoolTag,
    rawData = deps.getRuntimeGachaRawData(),
  ): GachaItemDefinition[] => {
    const activeTags = deps.getActiveGachaPoolTags(poolTag);
    const activeTagsKey = activeTags.join('|');
    const cached = deps.getGachaPoolDefinitionsCache();
    if (cached && cached.poolTag === poolTag && cached.rawData === rawData && cached.activeTagsKey === activeTagsKey) {
      return cached.items;
    }
    const items = deps.getAllGachaItemDefinitions(rawData)
      .filter(item => deps.isGachaItemEnabled(item) && item.poolTags.some(tag => activeTags.includes(tag)))
      .sort(deps.compareGachaItemDefinitionsForDisplay);
    deps.setGachaPoolDefinitionsCache({ poolTag, rawData, activeTagsKey, items });
    return items;
  };
  return getGachaPoolDefinitions;
}
