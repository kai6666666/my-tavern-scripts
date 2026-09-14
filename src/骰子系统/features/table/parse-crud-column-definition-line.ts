// @ts-nocheck
/**
 * parse-crud-column-definition-line.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createParseCrudColumnDefinitionLine(deps: any) {
  const parseCrudColumnDefinitionLine = (
    line: string,
  ): { columnName: string; definition: string; comment: string } | null => {
    if (/^\s*CREATE\s+TABLE\b/i.test(line)) return null;
    const match = line.match(new RegExp(`^\\s*${deps.getCRUD_SQL_IDENTIFIER_PATTERN()}(?=\\s)(.*?)(?:--\\s*(.+?)\\s*)?$`));
    if (!match) return null;
    const columnName = deps.decodeCrudSqlIdentifier(match[1], match[2], match[3], match[4]);
    if (!columnName) return null;
    return {
      columnName,
      definition: String(match[5] || ''),
      comment: deps.normalizeCrudSqlComment(match[6]),
    };
  };
  return parseCrudColumnDefinitionLine;
}
