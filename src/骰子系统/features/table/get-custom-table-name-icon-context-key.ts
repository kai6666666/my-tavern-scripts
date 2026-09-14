// @ts-nocheck
/**
 * get-custom-table-name-icon-context-key.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetCustomTableNameIconContextKey(deps: any) {
  const getCustomTableNameIconContextKey = (context: CustomTableNameIconContext): string =>
    [context.moduleId, context.tableName, context.section, context.name]
      .map(deps.normalizeCustomTableNameIconKeyPart)
      .join('||');
  return getCustomTableNameIconContextKey;
}
