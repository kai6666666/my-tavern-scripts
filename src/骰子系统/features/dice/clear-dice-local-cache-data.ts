// @ts-nocheck
/**
 * clear-dice-local-cache-data.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { FavoritesDB } from '../../shared/storage/favorites-db';
import { LocalAvatarDB } from '../../entities/local-avatar-db';
export function createClearDiceLocalCacheData(deps: any) {
  const clearDiceLocalCacheData = async (): Promise<number> => {
    let removedLocalStorageKeys = 0;

    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (!key) continue;
      if (key.startsWith('acu_')) {
        localStorage.removeItem(key);
        removedLocalStorageKeys++;
      }
    }

    await Promise.allSettled([LocalAvatarDB.clearAll(), FavoritesDB.clear(), deps.DiceHistoryStatsDB.clear()]);
    await deps.clearDiceSystemCache();

    return removedLocalStorageKeys;
  };
  return clearDiceLocalCacheData;
}
