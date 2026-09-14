// @ts-nocheck
/**
 * get-custom-table-name-icon-manager-section-label.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetCustomTableNameIconManagerSectionLabel(deps: any) {
  const getCustomTableNameIconManagerSectionLabel = (section: CustomTableNameIconSection): string =>
    deps.getCUSTOM_TABLE_NAME_ICON_MANAGER_SECTION_LABELS()[section] || section;
  return getCustomTableNameIconManagerSectionLabel;
}
