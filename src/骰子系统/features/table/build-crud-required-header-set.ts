// @ts-nocheck
/**
 * build-crud-required-header-set.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createBuildCrudRequiredHeaderSet(deps: any) {
  const buildCrudRequiredHeaderSet = (sheet: unknown): Set<string> => {
    const ddl = deps.stripCrudSqlNonStructuralComments(deps.getCrudSheetDdl(sheet));
    const headers = new Set<string>();
    if (!ddl) return headers;

    ddl.split(/\r?\n/).forEach(line => {
      const parsed = deps.parseCrudColumnDefinitionLine(line);
      if (!parsed) return;
      const { columnName, definition, comment } = parsed;
      if (!/\bNOT\s+NULL\b/i.test(definition)) return;
      if (/\bPRIMARY\s+KEY\b/i.test(definition)) return;
      if (columnName) headers.add(columnName);
      if (comment) headers.add(comment);
    });

    return headers;
  };
  return buildCrudRequiredHeaderSet;
}
