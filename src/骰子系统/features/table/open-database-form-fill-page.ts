// @ts-nocheck
/**
 * open-database-form-fill-page.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createOpenDatabaseFormFillPage(deps: any) {
  const openDatabaseFormFillPage = async (): Promise<boolean> => {
    if (deps.clickDatabaseNewUiFormFillNavigation()) {
      await deps.waitForDatabaseUiTick(deps.ACU_DATABASE_MANUAL_UPDATE_BUTTON_POLL_MS);
      if (await deps.waitForDatabaseManualUpdateSurface(480)) return true;
    }

    const opened = (await deps.openDatabaseNewUiViaApi()) || deps.openDatabaseNewUiViaMenuEntry();
    if (!opened && !deps.hasDatabaseNewUiRuntime()) return false;

    const deadline = Date.now() + deps.ACU_DATABASE_MANUAL_UPDATE_BUTTON_WAIT_MS;
    do {
      if (deps.clickDatabaseNewUiFormFillNavigation()) {
        await deps.waitForDatabaseUiTick(deps.ACU_DATABASE_MANUAL_UPDATE_BUTTON_POLL_MS);
        if (await deps.waitForDatabaseManualUpdateSurface(480)) return true;
      }
      await deps.waitForDatabaseUiTick(deps.ACU_DATABASE_MANUAL_UPDATE_BUTTON_POLL_MS);
    } while (Date.now() < deadline);

    return deps.waitForDatabaseManualUpdateSurface(deps.ACU_DATABASE_MANUAL_UPDATE_BUTTON_WAIT_MS);
  };
  return openDatabaseFormFillPage;
}
