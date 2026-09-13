// @ts-nocheck
/**
 * weighted-random-select.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createWeightedRandomSelect(deps: any) {
  const weightedRandomSelect = items => {
    if (!items || items.length === 0) return null;
    const totalWeight = items.reduce((sum, item) => sum + (item.weight || 1), 0);
    let random = Math.random() * totalWeight;
    for (const item of items) {
      random -= item.weight || 1;
      if (random <= 0) return item;
    }
    return items[items.length - 1];
  };
  return weightedRandomSelect;
}
