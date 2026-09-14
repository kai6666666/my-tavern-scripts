// @ts-nocheck
/**
 * clear-pending-deletions.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createClearPendingDeletions(deps: any) {
  const clearPendingDeletions = () => {
    deps.setPendingDeletions({});
  };
  return clearPendingDeletions;
}
