// @ts-nocheck
/**
 * find-database-new-ui-manual-update-button.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createFindDatabaseNewUiManualUpdateButton(deps: any) {
  const findDatabaseNewUiManualUpdateButton = ():
    | { status: 'found'; button: HTMLButtonElement }
    | { status: 'disabled'; text: string }
    | { status: 'unavailable' } => {
    let disabledButtonText = '';

    for (const targetWindow of deps.collectAccessibleRuntimeWindows()) {
      const targetDocument = deps.getAccessibleDocument(targetWindow);
      if (!targetDocument) continue;

      const rawButtons = Array.from(
        targetDocument.querySelectorAll<HTMLButtonElement>(deps.getACU_DATABASE_MANUAL_UPDATE_ACTION_SELECTOR()),
      );
      const candidateButtons = rawButtons.filter(
        button => deps.isElementVisibleInLayout(button) && deps.isDatabaseManualUpdateActionButton(button),
      );

      const manualButton =
        candidateButtons.find(button => {
          const text = deps.normalizeDatabaseUiText(button.textContent);
          return !deps.isDatabaseButtonDisabled(button) && text.includes('执行手动填表');
        }) ||
        candidateButtons.find(button => {
          const text = deps.normalizeDatabaseUiText(button.textContent);
          return !deps.isDatabaseButtonDisabled(button) && text.includes('交火索引已启用');
        }) ||
        candidateButtons.find(button => !deps.isDatabaseButtonDisabled(button));

      if (manualButton) return { status: 'found', button: manualButton };

      const disabledButton = candidateButtons.find(button => deps.isDatabaseButtonDisabled(button));
      if (disabledButton) {
        const buttonText = deps.normalizeDatabaseUiText(disabledButton.textContent);
        disabledButtonText = buttonText || '执行手动填表';
        continue;
      }
    }

    return disabledButtonText ? { status: 'disabled', text: disabledButtonText } : { status: 'unavailable' };
  };
  return findDatabaseNewUiManualUpdateButton;
}
