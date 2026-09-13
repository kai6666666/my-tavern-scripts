// @ts-nocheck
/**
 * same-headers.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createSameHeaders(deps: any) {
  const sameHeaders = (left, right): boolean =>
    JSON.stringify(deps.getSheetHeaders(left)) === JSON.stringify(deps.getSheetHeaders(right));
  return sameHeaders;
}
