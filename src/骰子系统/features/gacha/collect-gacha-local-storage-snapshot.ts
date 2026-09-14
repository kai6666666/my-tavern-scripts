// @ts-nocheck
/**
 * collect-gacha-local-storage-snapshot.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createCollectGachaLocalStorageSnapshot(deps: any) {
  const collectGachaLocalStorageSnapshot = (keys: readonly string[]): Map<string, string | null> => {
    const snapshot = new Map<string, string | null>();
    keys.forEach(key => snapshot.set(key, localStorage.getItem(key)));
    return snapshot;
  };
  return collectGachaLocalStorageSnapshot;
}
