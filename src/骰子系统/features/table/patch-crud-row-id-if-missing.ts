// @ts-nocheck
/**
 * patch-crud-row-id-if-missing.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createPatchCrudRowIdIfMissing(deps: any) {
  const patchCrudRowIdIfMissing = (
    row: DiffRow | null | undefined,
    rowId: unknown,
    patchedRows: CrudRowIdPatch[],
    seenRows: Set<DiffRow>,
  ): void => {
    if (!Array.isArray(row) || seenRows.has(row) || !deps.isCrudRowIdMissing(row[0])) return;
    seenRows.add(row);
    patchedRows.push({ row, originalValue: row[0] });
    row[0] = rowId;
  };
  return patchCrudRowIdIfMissing;
}
