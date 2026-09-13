// @ts-nocheck
/**
 * get-crud-table-identifier.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetCrudTableIdentifier(deps: any) {
  const getCrudTableIdentifier = (sheet: unknown, fallbackName: string): string =>
    deps.getCrudSqlTableName(sheet) || deps.normalizeDiffText(fallbackName);

  const buildCrudColumnAliasMap = (sheet: unknown): Record<string, string> => {
    const ddl = stripCrudSqlNonStructuralComments(getCrudSheetDdl(sheet));
    const aliases: Record<string, string> = {};
    if (!ddl) return aliases;

    ddl.split(/\r?\n/).forEach(line => {
      const parsed = parseCrudColumnDefinitionLine(line);
      if (!parsed) return;
      const { columnName, comment } = parsed;
      getCrudSqlCommentAliases(comment).forEach(alias => addCrudColumnAlias(aliases, alias, columnName));
    });

    return aliases;
  };
  return getCrudTableIdentifier;
}
