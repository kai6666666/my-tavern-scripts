// @ts-nocheck
/**
 * run-database-manual-update-via-legacy-button.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createRunDatabaseManualUpdateViaLegacyButton(deps: any) {
  const runDatabaseManualUpdateViaLegacyButton = (): DatabaseManualUpdateResult => {
    for (const targetWindow of deps.collectAccessibleRuntimeWindows()) {
      const targetDocument = deps.getAccessibleDocument(targetWindow);
      const manualUpdateButton = targetDocument?.querySelector<HTMLElement>(
        deps.getACU_DATABASE_LEGACY_MANUAL_UPDATE_BUTTON_SELECTOR(),
      );
      if (!manualUpdateButton || typeof manualUpdateButton.click !== 'function') continue;

      manualUpdateButton.click();
      return { status: 'updated', source: '旧版数据库设置面板手动填表按钮' };
    }

    return { status: 'unavailable' };
  };
  return runDatabaseManualUpdateViaLegacyButton;
}
