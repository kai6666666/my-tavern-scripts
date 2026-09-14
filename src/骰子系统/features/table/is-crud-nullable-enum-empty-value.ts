// @ts-nocheck
/**
 * is-crud-nullable-enum-empty-value.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createIsCrudNullableEnumEmptyValue(deps: any) {
  const isCrudNullableEnumEmptyValue = (value: unknown): boolean =>
    value === null || value === undefined || String(value).trim() === '';
  return isCrudNullableEnumEmptyValue;
}
