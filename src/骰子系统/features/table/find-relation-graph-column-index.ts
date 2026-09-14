// @ts-nocheck
/**
 * find-relation-graph-column-index.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createFindRelationGraphColumnIndex(deps: any) {
  const findRelationGraphColumnIndex = (headers: RelationGraphCell[], keywords: string[]): number => {
    for (let i = 0; i < headers.length; i++) {
      const header = String(headers[i] || '').toLowerCase();
      if (keywords.some(keyword => header.includes(keyword.toLowerCase()))) {
        return i;
      }
    }
    return -1;
  };
  return findRelationGraphColumnIndex;
}
