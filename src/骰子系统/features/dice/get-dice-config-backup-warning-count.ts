// @ts-nocheck
/**
 * get-dice-config-backup-warning-count.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetDiceConfigBackupWarningCount(deps: any) {
  const getDiceConfigBackupWarningCount = (backup: DiceConfigBackupDocument): number =>
    Object.values(backup.modules).reduce((count, payload) => count + (payload?.warnings?.length || 0), 0);
  return getDiceConfigBackupWarningCount;
}
