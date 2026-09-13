// @ts-nocheck
/**
 * get-object-record.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetObjectRecord(deps: any) {
  const getObjectRecord = (value: unknown): Record<string, unknown> =>
    value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
  return getObjectRecord;
}
