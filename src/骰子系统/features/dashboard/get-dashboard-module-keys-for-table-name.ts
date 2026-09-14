// @ts-nocheck
/**
 * get-dashboard-module-keys-for-table-name.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetDashboardModuleKeysForTableName(deps: any) {
  const getDashboardModuleKeysForTableName = (tableName: string): string[] => {
    const normalizedTableName = deps.normalizeGlobalInteractionCategoryText(tableName);
    if (!normalizedTableName) return [];

    return Object.entries(deps.getDashboardRuntimeConfig())
      .filter(([, moduleConfig]) =>
        moduleConfig.tableKeywords.some(keyword =>
          normalizedTableName.includes(deps.normalizeGlobalInteractionCategoryText(keyword)),
        ),
      )
      .map(([moduleKey]) => moduleKey);
  };
  return getDashboardModuleKeysForTableName;
}
