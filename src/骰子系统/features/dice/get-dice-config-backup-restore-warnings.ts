// @ts-nocheck
/**
 * get-dice-config-backup-restore-warnings.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetDiceConfigBackupRestoreWarnings(deps: any) {
  const getDiceConfigBackupRestoreWarnings = (
    backup: DiceConfigBackupDocument,
    warnings: readonly string[],
    moduleIds: readonly DiceConfigBackupModuleId[],
  ): string[] =>
    Array.from(
      new Set([
        ...warnings,
        ...moduleIds.flatMap(moduleId => backup.modules[moduleId]?.warnings || []),
      ]),
    );
  return getDiceConfigBackupRestoreWarnings;
}
