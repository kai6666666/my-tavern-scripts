// @ts-nocheck
/**
 * set-gacha-item-order.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createSetGachaItemOrder(deps: any) {
  const setGachaItemOrder = (itemId: string, order: number): boolean =>
    deps.updateGachaItemSetting(itemId, { order: deps.normalizeGachaItemOrder(order) });
  return setGachaItemOrder;
}
