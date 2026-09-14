// @ts-nocheck
/**
 * find-relation-graph-relation-column-match.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createFindRelationGraphRelationColumnMatch(deps: any) {
  const findRelationGraphRelationColumnMatch = (
    headers: RelationGraphCell[],
    configuredKeywords: string[],
  ): RelationGraphColumnMatch => {
    const configuredIndex = deps.findRelationGraphColumnIndex(headers, configuredKeywords);
    if (configuredIndex >= 0) {
      return { index: configuredIndex, isConfigured: true };
    }

    return {
      index: deps.findRelationGraphColumnIndex(headers, deps.getRELATION_GRAPH_FALLBACK_RELATION_COLUMN_KEYWORDS()),
      isConfigured: false,
    };
  };
  return findRelationGraphRelationColumnMatch;
}
