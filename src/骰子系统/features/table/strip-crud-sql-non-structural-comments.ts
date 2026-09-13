// @ts-nocheck
/**
 * strip-crud-sql-non-structural-comments.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createStripCrudSqlNonStructuralComments(deps: any) {
  const stripCrudSqlNonStructuralComments = (ddl: unknown): string =>
    deps.stripCrudSqlBlockComments(ddl)
      .split(/\r?\n/)
      .filter(line => !/^\s*--/.test(line))
      .join('\n');
  return stripCrudSqlNonStructuralComments;
}
