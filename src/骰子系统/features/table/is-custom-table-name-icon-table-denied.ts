// @ts-nocheck
/**
 * is-custom-table-name-icon-table-denied.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createIsCustomTableNameIconTableDenied(deps: any) {
  const isCustomTableNameIconTableDenied = (tableName: string): boolean => {
    const normalizedTableName = String(tableName || '').trim();
    if (!normalizedTableName) return true;
    if (deps.getCUSTOM_TABLE_NAME_ICON_DENIED_TABLE_NAMES().has(normalizedTableName)) return true;
    if (deps.isPlayerTableName(normalizedTableName) || deps.isNpcLikeTableName(normalizedTableName)) return true;
    return deps.resolveDashboardGlobalInteractionSectionKind(normalizedTableName) === 'character';
  };
  return isCustomTableNameIconTableDenied;
}
