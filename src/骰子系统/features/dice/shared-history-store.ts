// @ts-nocheck
/**
 * shared-history-store.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createSharedHistoryStore(deps: any) {
  const sharedHistoryStore = deps.getRootWindowWithHistory().__AcuDiceHistoryStore__;
  return sharedHistoryStore;
}
