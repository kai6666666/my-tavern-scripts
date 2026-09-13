// @ts-nocheck
/**
 * has-runtime-table-read-api.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createHasRuntimeTableReadApi(deps: any) {
  const hasRuntimeTableReadApi = (api: unknown): boolean => {
    const record = api as Record<string, unknown> | null | undefined;
    return typeof record?.getCurrentData === 'function' || typeof record?.exportTableAsJson === 'function';
  };
  return hasRuntimeTableReadApi;
}
