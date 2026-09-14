// @ts-nocheck
/**
 * get-stored-gacha-state-snapshot.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetStoredGachaStateSnapshot(deps: any) {
  const getStoredGachaStateSnapshot = (): Record<string, unknown> | null => deps.getGachaStore().load();
  return getStoredGachaStateSnapshot;
}
