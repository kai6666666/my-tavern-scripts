// @ts-nocheck
/**
 * is-two-dimensional-array.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createIsTwoDimensionalArray(deps: any) {
  const isTwoDimensionalArray = (value: unknown): value is unknown[][] =>
    Array.isArray(value) && value.every(row => Array.isArray(row));

  const normalizeInteractionLabel = (label: string): string => label.trim().toLowerCase();
  return isTwoDimensionalArray;
}
