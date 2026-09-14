// @ts-nocheck
/**
 * build-crud-length-constraint-map.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createBuildCrudLengthConstraintMap(deps: any) {
  const buildCrudLengthConstraintMap = (sheet: unknown): Record<string, number> => {
    const ddl = deps.stripCrudSqlComments(deps.getCrudSheetDdl(sheet));
    const constraints: Record<string, number> = {};
    if (!ddl) return constraints;

    const regex = new RegExp(
      `CHECK\\s*\\(\\s*(?:${deps.CRUD_SQL_IDENTIFIER_PATTERN}\\s+IS\\s+NULL\\s+OR\\s*)?LENGTH\\s*\\(\\s*${deps.CRUD_SQL_IDENTIFIER_PATTERN}\\s*\\)\\s*(<=|<)\\s*(\\d+)\\s*\\)`,
      'gi',
    );
    let match: RegExpExecArray | null = null;
    while ((match = regex.exec(ddl)) !== null) {
      const columnName = deps.decodeCrudSqlIdentifier(match[5], match[6], match[7], match[8]);
      const operator = String(match[9] || '').trim();
      const rawLimit = Math.floor(Number(match[10]) || 0);
      const maxLength = operator === '<' ? rawLimit - 1 : rawLimit;
      if (columnName && maxLength >= 0) {
        constraints[columnName] = constraints[columnName] === undefined ? maxLength : Math.min(constraints[columnName], maxLength);
      }
    }

    return constraints;
  };
  return buildCrudLengthConstraintMap;
}
