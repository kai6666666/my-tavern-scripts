// @ts-nocheck
/**
 * crud-sql-identifier-pattern.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createCrudSqlIdentifierPattern(deps: any) {
  const CRUD_SQL_IDENTIFIER_PATTERN = '(?:"((?:[^"]|"")*)"|`((?:[^`]|``)*)`|\\[([^\\]]+)\\]|([A-Za-z_][A-Za-z0-9_]*))';
  return CRUD_SQL_IDENTIFIER_PATTERN;
}
