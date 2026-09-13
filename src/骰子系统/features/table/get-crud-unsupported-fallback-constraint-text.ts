// @ts-nocheck
/**
 * get-crud-unsupported-fallback-constraint-text.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetCrudUnsupportedFallbackConstraintText(deps: any) {
  const getCrudUnsupportedFallbackConstraintText = (sheet: unknown): string => {
    let ddl = deps.stripCrudSqlComments(deps.getCrudSheetDdl(sheet));
    if (!ddl) return '';
    const enumCheckRegex = new RegExp(
      `CHECK\\s*\\(\\s*(?:${deps.CRUD_SQL_IDENTIFIER_PATTERN}\\s+IS\\s+NULL\\s+OR\\s*)?${deps.CRUD_SQL_IDENTIFIER_PATTERN}\\s+IN\\s*\\(([^)]*)\\)\\s*\\)`,
      'gi',
    );
    const lengthCheckRegex = new RegExp(
      `CHECK\\s*\\(\\s*(?:${deps.CRUD_SQL_IDENTIFIER_PATTERN}\\s+IS\\s+NULL\\s+OR\\s*)?LENGTH\\s*\\(\\s*${deps.CRUD_SQL_IDENTIFIER_PATTERN}\\s*\\)\\s*(?:<=|<)\\s*\\d+\\s*\\)`,
      'gi',
    );
    ddl = ddl.replace(enumCheckRegex, '').replace(lengthCheckRegex, '');
    const unsupportedConstraintPatterns = [
      /\bCHECK\s*\([^;\n]*/i,
      /\bUNIQUE\b(?:\s*\([^)]*\))?/i,
      /\b(?:FOREIGN\s+KEY|REFERENCES)\b[^,\n)]*/i,
    ];
    for (const pattern of unsupportedConstraintPatterns) {
      const constraint = deps.normalizeDiffText(ddl.match(pattern)?.[0]);
      if (constraint) return constraint;
    }
    return '';
  };
  return getCrudUnsupportedFallbackConstraintText;
}
