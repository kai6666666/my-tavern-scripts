// @ts-nocheck
/**
 * create-global-interaction-custom-table-name-icon-context.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createCreateGlobalInteractionCustomTableNameIconContext(deps: any) {
  const createGlobalInteractionCustomTableNameIconContext = (
    tableName: unknown,
    name: unknown,
  ): CustomTableNameIconContext | null => {
    const normalizedTableName = String(tableName ?? '').trim();
    const normalizedName = String(name ?? '').trim();
    if (!normalizedTableName || !normalizedName) return null;
    const dashboardContextInfo = deps.resolveDashboardCustomTableNameIconContextInfo(normalizedTableName);
    if (dashboardContextInfo) {
      return deps.createCustomTableNameIconContext(
        dashboardContextInfo.moduleId,
        normalizedTableName,
        dashboardContextInfo.section,
        normalizedName,
      );
    }
    const meta = deps.resolveGlobalInteractionSectionMeta(normalizedTableName);
    const section = meta.kind as CustomTableNameIconSection;
    if (section === 'character') return null;
    const moduleId = section === 'map' ? 'global-interaction-map-marker' : 'global-interaction-panel';
    return deps.createCustomTableNameIconContext(moduleId, normalizedTableName, section, normalizedName);
  };
  return createGlobalInteractionCustomTableNameIconContext;
}
