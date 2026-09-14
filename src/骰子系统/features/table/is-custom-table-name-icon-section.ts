// @ts-nocheck
/**
 * is-custom-table-name-icon-section.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createIsCustomTableNameIconSection(deps: any) {
  const isCustomTableNameIconSection = (value: string): value is CustomTableNameIconSection =>
    deps.getCUSTOM_TABLE_NAME_ICON_SECTIONS().includes(value as CustomTableNameIconSection);

  const normalizeCustomTableNameIconKeyPart = (value: unknown): string => String(value ?? '').trim();
  return isCustomTableNameIconSection;
}
