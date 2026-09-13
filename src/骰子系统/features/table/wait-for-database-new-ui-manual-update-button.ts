// @ts-nocheck
/**
 * wait-for-database-new-ui-manual-update-button.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createWaitForDatabaseNewUiManualUpdateButton(deps: any) {
  const waitForDatabaseNewUiManualUpdateButton = async (
    timeoutMs = deps.ACU_DATABASE_MANUAL_UPDATE_BUTTON_WAIT_MS,
  ): Promise<ReturnType<typeof deps.findDatabaseNewUiManualUpdateButton>> => {
    const deadline = Date.now() + timeoutMs;
    let latestDisabledText = '';

    do {
      const buttonResult = deps.findDatabaseNewUiManualUpdateButton();
      if (buttonResult.status === 'found') return buttonResult;
      if (buttonResult.status === 'disabled') latestDisabledText = buttonResult.text;

      await deps.waitForDatabaseUiTick(deps.ACU_DATABASE_MANUAL_UPDATE_BUTTON_POLL_MS);
    } while (Date.now() < deadline);

    return latestDisabledText ? { status: 'disabled', text: latestDisabledText } : { status: 'unavailable' };
  };
  return waitForDatabaseNewUiManualUpdateButton;
}
