// @ts-nocheck
/**
 * pick-weighted-value.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createPickWeightedValue(deps: any) {
  const pickWeightedValue = <T>(entries: Array<{ value: T; weight: number }>): T | null => {
    const safeEntries = entries.filter(entry => Number(entry.weight) > 0);
    if (safeEntries.length === 0) return null;
    const totalWeight = safeEntries.reduce((sum, entry) => sum + Number(entry.weight), 0);
    if (totalWeight <= 0) return safeEntries[0].value;
    let cursor = Math.random() * totalWeight;
    for (const entry of safeEntries) {
      cursor -= Number(entry.weight);
      if (cursor <= 0) return entry.value;
    }
    return safeEntries[safeEntries.length - 1].value;
  };
  return pickWeightedValue;
}
