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
    deps.saveStoredGachaActivePoolTag(poolTag);
    if (state) state.activePoolTag = poolTag;
    if (state) {
      deps.saveStoredGachaStateSnapshot(state);
    }
    try {
      deps.refreshGachaPoolSelectionUi(poolTag);
    } catch (error) {
      console.warn('[DICE][GACHA]刷新卡池选择失败:', error);
    }
    try {
      deps.refreshGachaShardShop();
    } catch (error) {
      console.warn('[DICE][GACHA]刷新碎片商店失败:', error);
    }
  };
  return updateGachaPoolTag;
}
