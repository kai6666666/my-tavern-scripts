// @ts-nocheck
/**
 * get-crud-sql-table-name.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetCrudSqlTableName(deps: any) {
  const getCrudSqlTableName = (sheet: unknown): string => {
    const ddl = deps.stripCrudSqlComments(deps.getCrudSheetDdl(sheet));
    const match = ddl.match(
      new RegExp(`\\bCREATE\\s+TABLE\\s+(?:IF\\s+NOT\\s+EXISTS\\s+)?${deps.getCRUD_SQL_IDENTIFIER_PATTERN()}`, 'i'),
    );
    return deps.normalizeDiffText(deps.decodeCrudSqlIdentifier(match?.[1], match?.[2], match?.[3], match?.[4]));
  };
  return getCrudSqlTableName;
}
