// @ts-nocheck
/**
 * update-gacha-pool-tag.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaPoolTag } from '../../entities/gacha-items';
export function createUpdateGachaPoolTag(deps: any) {
  const updateGachaPoolTag = (poolTag: GachaPoolTag) => {
    const state = deps.getGachaState(undefined, true);
    const currentPoolTag = deps.getGachaActivePoolTag(state);
    console.warn('[gacha-debug] updateGachaPoolTag', poolTag, 'current=', currentPoolTag, 'hasState=', Boolean(state));
    deps.saveStoredGachaActivePoolTag(poolTag);
    if (state) state.activePoolTag = poolTag;
    if (state) {
      const saved = deps.saveStoredGachaStateSnapshot(state);
      console.warn('[gacha-debug] state snapshot saved=', saved);
    }
    try {
      deps.refreshGachaPoolSelectionUi(poolTag);
      console.warn('[gacha-debug] pool selection refreshed');
    } catch (error) {
      console.warn('[gacha-debug] refresh pool selection error:', error);
    }
    try {
      deps.refreshGachaShardShop();
    } catch (error) {
      console.warn('[gacha-debug] refresh shard shop error:', error);
    }
  };
  return updateGachaPoolTag;
}
