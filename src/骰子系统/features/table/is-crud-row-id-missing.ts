// @ts-nocheck
/**
 * is-crud-row-id-missing.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createIsCrudRowIdMissing(deps: any) {
  const isCrudRowIdMissing = (value: unknown): boolean =>
    value === null || value === undefined || String(value).trim() === '';
  return isCrudRowIdMissing;
}
