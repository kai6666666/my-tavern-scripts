// @ts-nocheck
/**
 * get-all-gacha-pool-config-definitions.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaPoolDefinition } from '../../entities/gacha-items';
export function createGetAllGachaPoolConfigDefinitions(deps: any) {
  const getAllGachaPoolConfigDefinitions = (rawData = deps.getRuntimeGachaRawData()): GachaPoolDefinition[] => {
    return deps.getGachaPoolDefinitionsWithVirtualTags(deps.collectGachaPoolTagsFromItems(rawData));
  };
  return getAllGachaPoolConfigDefinitions;
}
