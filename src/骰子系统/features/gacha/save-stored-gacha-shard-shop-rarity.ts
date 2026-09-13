// @ts-nocheck
/**
 * save-stored-gacha-shard-shop-rarity.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { Store } from '../../shared/storage/store';
import { STORAGE_KEY_GACHA_SHARD_SHOP_RARITY } from '../../shared/storage-keys';
import type { GachaRarity } from '../../entities/gacha-items';
export function createSaveStoredGachaShardShopRarity(deps: any) {
  const saveStoredGachaShardShopRarity = (rarity: GachaRarity) => {
    Store.set(STORAGE_KEY_GACHA_SHARD_SHOP_RARITY, rarity);
  };
  return saveStoredGachaShardShopRarity;
}
