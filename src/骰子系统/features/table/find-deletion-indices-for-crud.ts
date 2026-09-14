// @ts-nocheck
/**
 * find-deletion-indices-for-crud.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createFindDeletionIndicesForCrud(deps: any) {
  const findDeletionIndicesForCrud = (oldRows, desiredRows): number[] | null => {
    if (desiredRows.length > oldRows.length) return null;
    const desiredKeys = desiredRows.map(deps.getStableRowKeyForCrud);
    const keepIndices: number[] = [];
    let searchFrom = 0;

    for (const desiredKey of desiredKeys) {
      let found = -1;
      for (let index = searchFrom; index < oldRows.length; index++) {
        if (deps.getStableRowKeyForCrud(oldRows[index]) === desiredKey) {
          found = index;
          break;
        }
      }
      if (found === -1) return null;
      keepIndices.push(found);
      searchFrom = found + 1;
    }

    const keepSet = new Set(keepIndices);
    return oldRows.map((_, index) => index).filter(index => !keepSet.has(index));
  };
  return findDeletionIndicesForCrud;
}
