// @ts-nocheck
/**
 * get-crud-sql-comment-aliases.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetCrudSqlCommentAliases(deps: any) {
  const getCrudSqlCommentAliases = (comment: unknown): string[] => {
    const fullComment = deps.normalizeCrudSqlComment(comment);
    if (!fullComment) return [];
    const aliases = [fullComment];
    const looseComment = fullComment.replace(/[（(].*$/, '').trim();
    if (looseComment && looseComment !== fullComment) aliases.push(looseComment);
    return Array.from(new Set(aliases));
  };
  return getCrudSqlCommentAliases;
}
