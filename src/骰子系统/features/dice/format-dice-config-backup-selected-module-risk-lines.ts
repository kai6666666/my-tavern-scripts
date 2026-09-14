// @ts-nocheck
/**
 * format-dice-config-backup-selected-module-risk-lines.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createFormatDiceConfigBackupSelectedModuleRiskLines(deps: any) {
  const formatDiceConfigBackupSelectedModuleRiskLines = (moduleIds: readonly DiceConfigBackupModuleId[]): string[] =>
    moduleIds.map(moduleId => {
      const definition = deps.getDiceConfigBackupModuleDefinition(moduleId);
      return `${definition?.name || moduleId}: ${deps.getDICE_CONFIG_BACKUP_PRIVACY_RISK_TEXT()[moduleId]}`;
    });
  return formatDiceConfigBackupSelectedModuleRiskLines;
}
