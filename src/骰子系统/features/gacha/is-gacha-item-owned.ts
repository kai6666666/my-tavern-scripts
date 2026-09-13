// @ts-nocheck
/**
 * is-gacha-item-owned.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaItemDefinition } from '../../entities/gacha-items';
export function createIsGachaItemOwned(deps: any) {
  const isGachaItemOwned = (rawData, item: GachaItemDefinition): boolean => {
    try {
      const parsed = deps.getGachaRewardParseResultForItem(rawData, item);
      return parsed.items.some(candidate => candidate.name === item.name);
    } catch {
      return false;
    }
  };
  return isGachaItemOwned;
}
