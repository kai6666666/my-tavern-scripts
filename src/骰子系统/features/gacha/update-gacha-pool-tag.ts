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
    if (currentPoolTag === poolTag) return;
    deps.saveStoredGachaActivePoolTag(poolTag);
    if (state) state.activePoolTag = poolTag;
    if (state && !deps.saveStoredGachaStateSnapshot(state)) return;
    deps.refreshGachaPoolSelectionUi(poolTag);
    deps.refreshGachaShardShop();
  };
  return updateGachaPoolTag;
}
