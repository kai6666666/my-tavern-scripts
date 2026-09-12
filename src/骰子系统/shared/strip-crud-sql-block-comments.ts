// @ts-nocheck
/**
 * strip-crud-sql-block-comments.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createStripCrudSqlBlockComments(deps: any) {
  const stripCrudSqlBlockComments = (ddl: unknown): string => {
    const text = String(ddl || '');
    let result = '';
    let index = 0;
    let inSingleQuote = false;
    let inDoubleQuote = false;
    let inBracketQuote = false;
    let inBacktickQuote = false;
    while (index < text.length) {
      const char = text[index];
      const next = text[index + 1];
      if (inSingleQuote) {
        result += char;
        if (char === "'" && next === "'") {
          result += next;
          index += 2;
          continue;
        }
        if (char === "'") inSingleQuote = false;
        index += 1;
        continue;
      }
      if (inDoubleQuote) {
        result += char;
        if (char === '"' && next === '"') {
          result += next;
          index += 2;
          continue;
        }
        if (char === '"') inDoubleQuote = false;
        index += 1;
        continue;
      }
      if (inBracketQuote) {
        result += char;
        if (char === ']') inBracketQuote = false;
        index += 1;
        continue;
      }
      if (inBacktickQuote) {
        result += char;
        if (char === '`' && next === '`') {
          result += next;
          index += 2;
          continue;
        }
        if (char === '`') inBacktickQuote = false;
        index += 1;
        continue;
      }
      if (char === "'") {
        inSingleQuote = true;
        result += char;
        index += 1;
        continue;
      }
      if (char === '"') {
        inDoubleQuote = true;
        result += char;
        index += 1;
        continue;
      }
      if (char === '[') {
        inBracketQuote = true;
        result += char;
        index += 1;
        continue;
      }
      if (char === '`') {
        inBacktickQuote = true;
        result += char;
        index += 1;
        continue;
      }
      if (char === '/' && next === '*') {
        index += 2;
        while (index < text.length && !(text[index] === '*' && text[index + 1] === '/')) {
          if (text[index] === '\n') result += '\n';
          index += 1;
        }
        index += index < text.length ? 2 : 0;
        continue;
      }
      result += char;
      index += 1;
    }
    return result;
  };
  return stripCrudSqlBlockComments;
}
