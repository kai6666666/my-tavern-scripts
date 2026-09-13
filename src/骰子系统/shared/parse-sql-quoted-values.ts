// @ts-nocheck
/**
 * parse-sql-quoted-values.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createParseSqlQuotedValues(deps: any) {
  const parseSqlQuotedValues = (value: string): string[] => {
    const values: string[] = [];
    const regex = /'((?:''|[^'])*)'/g;
    let match: RegExpExecArray | null = null;
    while ((match = regex.exec(String(value || ''))) !== null) {
      values.push(String(match[1] || '').replace(/''/g, "'"));
    }
    return values;
  };
  return parseSqlQuotedValues;
}
