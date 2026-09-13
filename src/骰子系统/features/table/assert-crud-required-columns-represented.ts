// @ts-nocheck
/**
 * assert-crud-required-columns-represented.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createAssertCrudRequiredColumnsRepresented(deps: any) {
  const assertCrudRequiredColumnsRepresented = (tableName: string, headers, sheet): void => {
    if (!Array.isArray(headers)) return;
    const requiredHeaders = deps.buildCrudRequiredHeaderSet(sheet);
    if (requiredHeaders.size === 0) return;
    const headerSet = new Set(headers.map(header => deps.normalizeDiffText(header)).filter(Boolean));
    const aliasMap = deps.buildCrudColumnAliasMap(sheet);
    const represented = new Set<string>();
    const representedColumns = new Set<string>();
    headerSet.forEach(headerName => {
      represented.add(headerName);
      represented.add(deps.normalizeCrudHeaderLookupKey(headerName));
      const columnName = deps.getCrudColumnNameForHeader(aliasMap, headerName);
      if (columnName) {
        represented.add(columnName);
        representedColumns.add(columnName);
      }
    });
    Object.entries(aliasMap).forEach(([comment, columnName]) => {
      if (representedColumns.has(String(columnName || '').trim())) represented.add(comment);
    });
    const missing = Array.from(requiredHeaders).filter(headerName => !represented.has(headerName));
    if (missing.length === 0) return;
    throw new Error(
      `表 "${tableName}" 的 DDL 存在必填列未出现在表头中：${missing.join('、')}。请先修正表头/DDL，确保每个 NOT NULL 列都有可写入的表头或注释别名。`,
    );
  };
  return assertCrudRequiredColumnsRepresented;
}
