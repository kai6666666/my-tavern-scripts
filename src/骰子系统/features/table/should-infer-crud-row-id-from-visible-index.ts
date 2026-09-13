// @ts-nocheck
/**
 * should-infer-crud-row-id-from-visible-index.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createShouldInferCrudRowIdFromVisibleIndex(deps: any) {
  const shouldInferCrudRowIdFromVisibleIndex = (input: CrudExistingRowPatchInput): boolean => {
    const firstHeader = deps.normalizeDiffHeader(input.headers[0]);
    if (firstHeader === 'row_id' || firstHeader === '行号') return true;
    return /\brow_id\s+INTEGER\s+PRIMARY\s+KEY\b/i.test(deps.getCrudSheetDdl(input.sheet));
  };
  return shouldInferCrudRowIdFromVisibleIndex;
}
