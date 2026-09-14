// @ts-nocheck
/**
 * show-dice-config-backup-privacy-confirm.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createShowDiceConfigBackupPrivacyConfirm(deps: any) {
  const showDiceConfigBackupPrivacyConfirm = (
    mode: 'export' | 'restore',
    moduleIds: readonly DiceConfigBackupModuleId[],
    backup?: DiceConfigBackupDocument,
  ): Promise<boolean> =>
    deps.showDiceSystemConfirmDialog({
      title: mode === 'export' ? '导出配置备份' : '恢复配置备份',
      message:
        mode === 'export' ? '备份文件可能包含可识别的私密配置。' : '恢复外来备份可能覆盖本地配置并启用对方规则。',
      detail: deps.formatDiceConfigBackupPrivacyDetail(mode, moduleIds, backup),
      iconClass: 'fa-triangle-exclamation',
      confirmText: mode === 'export' ? '确认导出' : '确认恢复',
      cancelText: '取消',
      tone: 'warning',
    });
  return showDiceConfigBackupPrivacyConfirm;
}
