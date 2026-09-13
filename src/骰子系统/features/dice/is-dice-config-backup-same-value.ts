// @ts-nocheck
/**
 * is-dice-config-backup-same-value.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createIsDiceConfigBackupSameValue(deps: any) {
  const isDiceConfigBackupSameValue = (left: unknown, right: unknown): boolean => {
    try {
      return JSON.stringify(left) === JSON.stringify(right);
    } catch {
      return left === right;
    }
  };
  return isDiceConfigBackupSameValue;
}
