// @ts-nocheck
/**
 * update-gacha-shop-progress-ui.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createUpdateGachaShopProgressUi(deps: any) {
  const updateGachaShopProgressUi = (): boolean => {
    if (!deps.getGachaShopProgressContainers().length) return false;
    const state = deps.getGachaState(undefined, true);
    if (!state) return false;
    return deps.updateGachaFortuneProgressDom(state, true);
  };
  return updateGachaShopProgressUi;
}
