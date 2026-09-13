// @ts-nocheck
/**
 * get-dice-config-backup-selected-module-ids-from-dialog.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetDiceConfigBackupSelectedModuleIdsFromDialog(deps: any) {
  const getDiceConfigBackupSelectedModuleIdsFromDialog = (dialog: JQuery): DiceConfigBackupModuleId[] =>
    deps.normalizeDiceConfigBackupSelectedModuleIds(
      dialog
        .find<HTMLInputElement>('.acu-config-backup-module-checkbox:checked')
        .map((_, element) => String(element.value || ''))
        .get(),
    );
  return getDiceConfigBackupSelectedModuleIdsFromDialog;
}
