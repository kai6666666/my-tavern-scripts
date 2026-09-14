// @ts-nocheck
/**
 * get-pending-deletions.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetPendingDeletions(deps: any) {
  const getPendingDeletions = () => deps.getPendingDeletions();
  return getPendingDeletions;
}
