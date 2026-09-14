// @ts-nocheck
/**
 * normalize-crud-header-lookup-key.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createNormalizeCrudHeaderLookupKey(deps: any) {
  const normalizeCrudHeaderLookupKey = (value: unknown): string =>
    deps.normalizeDiffText(value)
      .replace(/（/g, '(')
      .replace(/）/g, ')');
  return normalizeCrudHeaderLookupKey;
}
