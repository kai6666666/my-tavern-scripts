// @ts-nocheck
/**
 * is-record-value.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createIsRecordValue(deps: any) {
  const isRecordValue = (value: unknown): value is Record<string, unknown> =>
    Boolean(value) && typeof value === 'object' && !Array.isArray(value);
  return isRecordValue;
}
