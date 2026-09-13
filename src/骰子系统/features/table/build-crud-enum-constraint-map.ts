// @ts-nocheck
/**
 * build-crud-enum-constraint-map.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createBuildCrudEnumConstraintMap(deps: any) {
  const buildCrudEnumConstraintMap = (sheet: unknown): Record<string, RuntimeCrudEnumConstraint> => {
    const ddl = deps.stripCrudSqlComments(deps.getCrudSheetDdl(sheet));
    const constraints: Record<string, RuntimeCrudEnumConstraint> = {};
    if (!ddl) return constraints;

    const regex = new RegExp(
      `CHECK\\s*\\(\\s*(?:${deps.CRUD_SQL_IDENTIFIER_PATTERN}\\s+IS\\s+NULL\\s+OR\\s*)?${deps.CRUD_SQL_IDENTIFIER_PATTERN}\\s+IN\\s*\\(([^)]*)\\)\\s*\\)`,
      'gi',
    );
    let match: RegExpExecArray | null = null;
    while ((match = regex.exec(ddl)) !== null) {
      const nullableColumnName = deps.decodeCrudSqlIdentifier(match[1], match[2], match[3], match[4]);
      const columnName = deps.decodeCrudSqlIdentifier(match[5], match[6], match[7], match[8]);
      const values = deps.parseSqlQuotedValues(match[9] || '');
      if (columnName && values.length > 0) {
        constraints[columnName] = {
          values,
          nullable: Boolean(nullableColumnName && nullableColumnName === columnName),
        };
      }
    }

    return constraints;
  };
  return buildCrudEnumConstraintMap;
}
