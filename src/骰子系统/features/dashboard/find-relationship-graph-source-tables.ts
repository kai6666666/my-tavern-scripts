// @ts-nocheck
/**
 * find-relationship-graph-source-tables.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createFindRelationshipGraphSourceTables(deps: any) {
  const findRelationshipGraphSourceTables = (
    allTables: Record<string, RelationGraphTableInput>,
    tableKeywords: string[],
  ): RelationshipGraphSourceTableMatch[] => {
    const matches: RelationshipGraphSourceTableMatch[] = [];
    const matchedTableNames = new Set<string>();

    for (const keyword of tableKeywords) {
      for (const tableName in allTables) {
        if (tableName.includes(keyword) && !matchedTableNames.has(tableName)) {
          matchedTableNames.add(tableName);
          matches.push({ tableName, table: allTables[tableName] });
        }
      }
    }
    return matches;
  };
  return findRelationshipGraphSourceTables;
}
