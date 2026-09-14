// @ts-nocheck
/**
 * resolve-dashboard-global-interaction-section-kind.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createResolveDashboardGlobalInteractionSectionKind(deps: any) {
  const resolveDashboardGlobalInteractionSectionKind = (tableName: string): GlobalInteractionSectionKind | null => {
    for (const moduleKey of deps.getDashboardModuleKeysForTableName(tableName)) {
      const sectionKind = deps.getDASHBOARD_MODULE_SECTION_KIND()[moduleKey];
      if (sectionKind) return sectionKind;
    }
    return null;
  };
  return resolveDashboardGlobalInteractionSectionKind;
}
