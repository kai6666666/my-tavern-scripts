// @ts-nocheck
/**
 * normalize-crud-sql-comment.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createNormalizeCrudSqlComment(deps: any) {
  const normalizeCrudSqlComment = (comment: unknown): string =>
    String(comment || '')
      .replace(/[，,].*$/, '')
      .trim();
  return normalizeCrudSqlComment;
}
