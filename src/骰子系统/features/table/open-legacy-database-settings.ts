// @ts-nocheck
/**
 * open-legacy-database-settings.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createOpenLegacyDatabaseSettings(deps: any) {
  const openLegacyDatabaseSettings = (): boolean => {
    const api = deps.getCore().getDB();
    if (api && typeof api.openSettings === 'function') {
      api.openSettings();
      return true;
    }
    return false;
  };
  return openLegacyDatabaseSettings;
}
