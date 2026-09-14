// @ts-nocheck
/**
 * build-crud-column-alias-map.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createBuildCrudColumnAliasMap(deps: any) {
  const buildCrudColumnAliasMap = (sheet: unknown): Record<string, string> => {
    const ddl = deps.stripCrudSqlNonStructuralComments(deps.getCrudSheetDdl(sheet));
    const aliases: Record<string, string> = {};
    if (!ddl) return aliases;

    ddl.split(/\r?\n/).forEach(line => {
      const parsed = deps.parseCrudColumnDefinitionLine(line);
      if (!parsed) return;
      const { columnName, comment } = parsed;
      deps.getCrudSqlCommentAliases(comment).forEach(alias => deps.addCrudColumnAlias(aliases, alias, columnName));
    });

    return aliases;
  };
  return buildCrudColumnAliasMap;
}
