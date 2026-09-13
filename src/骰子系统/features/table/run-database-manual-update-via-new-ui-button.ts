// @ts-nocheck
/**
 * run-database-manual-update-via-new-ui-button.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createRunDatabaseManualUpdateViaNewUiButton(deps: any) {
  const runDatabaseManualUpdateViaNewUiButton = async (): Promise<DatabaseManualUpdateResult> => {
    let buttonResult = await deps.waitForDatabaseNewUiManualUpdateButton(360);

    if (buttonResult.status === 'unavailable' && (await deps.openDatabaseFormFillPage())) {
      buttonResult = await deps.waitForDatabaseNewUiManualUpdateButton();
    }

    if (buttonResult.status === 'found') {
      buttonResult.button.click();
      return { status: 'updated', source: '新版填表工作台按钮' };
    }

    if (buttonResult.status === 'disabled') {
      return {
        status: 'failed',
        source: '新版填表工作台按钮',
        error: `新版填表工作台的「${buttonResult.text}」按钮当前不可用，请先选择至少一张表，或等待当前填表完成。`,
      };
    }

    return { status: 'unavailable' };
  };
  return runDatabaseManualUpdateViaNewUiButton;
}
