// @ts-nocheck
/**
 * restore-gacha-local-storage-snapshot.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createRestoreGachaLocalStorageSnapshot(deps: any) {
  const restoreGachaLocalStorageSnapshot = (snapshot: ReadonlyMap<string, string | null>): string[] => {
    const warnings: string[] = [];
    snapshot.forEach((value, key) => {
      try {
        if (value === null) {
          localStorage.removeItem(key);
        } else {
          localStorage.setItem(key, value);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        warnings.push(`${key} 回滚失败：${message}`);
      }
    });
    return warnings;
  };
  return restoreGachaLocalStorageSnapshot;
}
