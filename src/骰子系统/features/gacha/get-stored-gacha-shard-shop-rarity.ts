// @ts-nocheck
/**
 * get-stored-gacha-shard-shop-rarity.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { Store } from '../../shared/storage/store';
import { STORAGE_KEY_GACHA_SHARD_SHOP_RARITY } from '../../shared/storage-keys';
import type { GachaRarity } from '../../entities/gacha-items';
import { GACHA_RARITY_ORDER } from '../../entities/gacha-items';
export function createGetStoredGachaShardShopRarity(deps: any) {
  const getStoredGachaShardShopRarity = (): GachaRarity => {
    const stored = String(Store.get(STORAGE_KEY_GACHA_SHARD_SHOP_RARITY, '普通') || '普通') as GachaRarity;
    return GACHA_RARITY_ORDER.includes(stored) ? stored : '普通';
  };
  return getStoredGachaShardShopRarity;
}
