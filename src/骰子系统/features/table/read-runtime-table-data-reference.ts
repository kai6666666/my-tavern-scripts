// @ts-nocheck
/**
 * read-runtime-table-data-reference.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createReadRuntimeTableDataReference(deps: any) {
  const readRuntimeTableDataReference = (api: unknown): unknown => {
    const record = api as Record<string, unknown> | null | undefined;
    if (typeof record?.exportTableAsJson === 'function') {
      return (record.exportTableAsJson as () => unknown).call(api);
    }
    return deps.readRuntimeTableData(api);
  };
  return readRuntimeTableDataReference;
}
