// @ts-nocheck
/**
 * normalize-gacha-item-order.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createNormalizeGachaItemOrder(deps: any) {
  const normalizeGachaItemOrder = (value: unknown, fallback = 999): number => {
    const order = Number(value);
    return Number.isFinite(order) ? Math.max(1, Math.floor(order)) : fallback;
  };
  return normalizeGachaItemOrder;
}
