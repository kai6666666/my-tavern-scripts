// @ts-nocheck
/**
 * resolve-runtime-mutation-source.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createResolveRuntimeMutationSource(deps: any) {
  const resolveRuntimeMutationSource = (
    tableKey: string,
  ): { data: unknown; entry: { key: string; sheet: DiffSheet } } | null => {
    const sources = [deps.getTableData({ silent: true }), deps.getCachedRawData(), deps.loadSnapshot()];
    for (const data of sources) {
      const entry = deps.findRuntimeSheetEntryForMutation(data, tableKey);
      if (entry?.sheet) return { data, entry };
    }
    return null;
  };
  return resolveRuntimeMutationSource;
}
