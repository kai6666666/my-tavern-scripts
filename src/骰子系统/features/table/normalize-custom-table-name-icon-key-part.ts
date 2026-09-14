// @ts-nocheck
/**
 * normalize-custom-table-name-icon-key-part.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createNormalizeCustomTableNameIconKeyPart(deps: any) {
  const normalizeCustomTableNameIconKeyPart = (value: unknown): string => String(value ?? '').trim();
  return normalizeCustomTableNameIconKeyPart;
}
