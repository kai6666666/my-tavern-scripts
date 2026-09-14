// @ts-nocheck
/**
 * read-runtime-table-data.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createReadRuntimeTableData(deps: any) {
  const readRuntimeTableData = (api: unknown): unknown => {
    const record = api as Record<string, unknown> | null | undefined;
    if (typeof record?.getCurrentData === 'function') {
      return (record.getCurrentData as () => unknown).call(api);
    }
    // 数据库本体当前公开面仍把只读快照暴露在 exportTableAsJson；写入保存必须走下方 CRUD。
    if (typeof record?.exportTableAsJson === 'function') {
      return (record.exportTableAsJson as () => unknown).call(api);
    }
    return null;
  };
  return readRuntimeTableData;
}
