// @ts-nocheck
/**
 * get-custom-table-name-icon-manager-local-key.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetCustomTableNameIconManagerLocalKey(deps: any) {
  const getCustomTableNameIconManagerLocalKey = (context: CustomTableNameIconContext): string =>
    `custom-table-name-icon::${deps.getCustomTableNameIconContextKey(context)}`;
  return getCustomTableNameIconManagerLocalKey;
}
