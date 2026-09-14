// @ts-nocheck
type RuntimeCrudWriteApi = any;
/**
 * assert-runtime-crud-api.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createAssertRuntimeCrudApi(deps: any) {
  const assertRuntimeCrudApi = (): RuntimeCrudWriteApi => {
    const api = deps.getCore().getDB() as RuntimeCrudWriteApi | null | undefined;
    const apiRecord = api as Record<string, unknown> | null | undefined;
    const requiredMethods = ['updateCell', 'insertRow', 'deleteRow'] as const;
    const missing = requiredMethods.filter(method => typeof apiRecord?.[method] !== 'function');
    if (!deps.hasRuntimeTableReadApi(api)) missing.push('getCurrentData/exportTableAsJson');
    if (missing.length > 0) {
      throw new Error(`数据库本体版本过低，缺少新版表格 CRUD API：${missing.join(', ')}。请升级数据库本体后再保存。`);
    }
    return api;
  };
  return assertRuntimeCrudApi;
}
