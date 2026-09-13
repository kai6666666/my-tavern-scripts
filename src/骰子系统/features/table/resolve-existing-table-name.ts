// @ts-nocheck
/**
 * resolve-existing-table-name.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createResolveExistingTableName(deps: any) {
  const resolveExistingTableName = (tableNameValue: unknown): string | null => {
    const tableName = String(tableNameValue ?? '');
    if (tableName.length === 0) return null;

    const rawData = deps.getCachedRawData() || deps.getTableData();
    const tables = deps.processJsonData(rawData || {});
    return Object.prototype.hasOwnProperty.call(tables, tableName) ? tableName : null;
  };
  return resolveExistingTableName;
}
