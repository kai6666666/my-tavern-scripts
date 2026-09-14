// @ts-nocheck
/**
 * decode-crud-sql-identifier.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createDecodeCrudSqlIdentifier(deps: any) {
  const decodeCrudSqlIdentifier = (...values: unknown[]): string => {
    const raw = values.find(value => typeof value === 'string');
    return String(raw || '')
      .replace(/""/g, '"')
      .replace(/``/g, '`')
      .replace(/]]/g, ']')
      .trim();
  };
  return decodeCrudSqlIdentifier;
}
