// @ts-nocheck
/**
 * get-dice-config-backup-module-count-text.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetDiceConfigBackupModuleCountText(deps: any) {
  const getDiceConfigBackupModuleCountText = (
    moduleId: DiceConfigBackupModuleId,
    storageCount: number,
    resourceCount: number,
    hasBackupPayload: boolean,
  ): string => {
    if (moduleId === 'tableTemplate' && !hasBackupPayload) return '模板';
    if (storageCount > 0 && resourceCount > 0) return `${storageCount}+${resourceCount} 项`;
    return `${storageCount + resourceCount} 项`;
  };
  return getDiceConfigBackupModuleCountText;
}
