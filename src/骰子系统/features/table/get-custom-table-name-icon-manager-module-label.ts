// @ts-nocheck
/**
 * get-custom-table-name-icon-manager-module-label.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetCustomTableNameIconManagerModuleLabel(deps: any) {
  const getCustomTableNameIconManagerModuleLabel = (moduleId: CustomTableNameIconModuleId): string =>
    deps.getCUSTOM_TABLE_NAME_ICON_MANAGER_MODULE_LABELS()[moduleId] || moduleId;
  return getCustomTableNameIconManagerModuleLabel;
}
