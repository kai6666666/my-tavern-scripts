// @ts-nocheck
/**
 * get-gacha-rarity-icon-class.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaRarity } from '../../entities/gacha-items';
export function createGetGachaRarityIconClass(deps: any) {
  const getGachaRarityIconClass = (rarity: GachaRarity): string =>
    deps.getINVENTORY_QUALITY_FILTER_META().find(option => option.value === rarity)?.icon || 'fa-gem';
  return getGachaRarityIconClass;
}
