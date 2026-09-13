// @ts-nocheck
/**
 * wait-for-database-manual-update-surface.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createWaitForDatabaseManualUpdateSurface(deps: any) {
  const waitForDatabaseManualUpdateSurface = async (timeoutMs = deps.ACU_DATABASE_MANUAL_UPDATE_BUTTON_WAIT_MS) => {
    const start = Date.now();

    do {
      if (deps.hasDatabaseManualUpdateSurface()) return true;

      await deps.waitForDatabaseUiTick(deps.ACU_DATABASE_MANUAL_UPDATE_BUTTON_POLL_MS);
    } while (Date.now() - start < timeoutMs);

    return false;
  };
  return waitForDatabaseManualUpdateSurface;
}
