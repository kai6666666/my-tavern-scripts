// @ts-nocheck
/**
 * get-all-gacha-item-definitions.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { GACHA_ITEM_DEFINITIONS } from '../../entities/gacha-items';
import type { GachaItemDefinition } from '../../entities/gacha-items';
export function createGetAllGachaItemDefinitions(deps: any) {
  const getAllGachaItemDefinitions = (rawData = deps.getRuntimeGachaRawData()): GachaItemDefinition[] => {
    const byId = new Map<string, GachaItemDefinition>();
    GACHA_ITEM_DEFINITIONS.forEach(item => byId.set(item.id, item));
    deps.getCustomGachaItemDefinitions(rawData).forEach(item => byId.set(item.id, item));
    const settings = deps.getStoredGachaItemSettings();
    return Array.from(byId.values()).map(item => deps.withGachaItemSettings(item, settings));
  };
  return getAllGachaItemDefinitions;
}
