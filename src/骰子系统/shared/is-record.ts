// @ts-nocheck
/**
 * is-record.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createIsRecord(deps: any) {
  const isRecord = (value: unknown): value is Record<string, unknown> =>
    Boolean(value) && typeof value === 'object' && !Array.isArray(value);
  return isRecord;
}
