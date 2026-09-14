// @ts-nocheck
/**
 * get-gacha-shard-label.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { FORTUNE_CURRENCY_NAME } from '../../entities/gacha-items';
import type { GachaRarity } from './gacha-types';
export function createGetGachaShardLabel(deps: any) {
  const getGachaShardLabel = (rarity: GachaRarity): string => `${rarity}${FORTUNE_CURRENCY_NAME}碎片`;
  return getGachaShardLabel;
}
