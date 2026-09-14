// @ts-nocheck
/**
 * show-dice-profile-apply-confirm.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createShowDiceProfileApplyConfirm(deps: any) {
  const showDiceProfileApplyConfirm = async (
    profile: DiceProfileRecord,
    moduleIds: readonly DiceConfigBackupModuleId[],
  ): Promise<boolean> => {
    const allWarnings = deps.getDiceConfigBackupRestoreWarnings(profile.backup, [], moduleIds);
    return deps.showDiceSystemConfirmDialog({
      title: '应用配置方案',
      message: `应用「${profile.name}」？`,
      detailHtml: deps.renderDiceProfileApplyConfirmDetailHtml(moduleIds, allWarnings),
      iconClass: 'fa-layer-group',
      confirmText: '应用配置方案',
      cancelText: '取消',
      tone: 'warning',
    });
  };
  return showDiceProfileApplyConfirm;
}
