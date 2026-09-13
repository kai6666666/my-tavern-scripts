// @ts-nocheck
/**
 * is-custom-table-name-icon-module-id.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createIsCustomTableNameIconModuleId(deps: any) {
  const isCustomTableNameIconModuleId = (value: string): value is CustomTableNameIconModuleId =>
    deps.getCUSTOM_TABLE_NAME_ICON_MODULE_IDS().includes(value as CustomTableNameIconModuleId);
  return isCustomTableNameIconModuleId;
}
