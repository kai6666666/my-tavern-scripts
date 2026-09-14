// @ts-nocheck
/**
 * get-inventory-metadata-context-key.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetInventoryMetadataContextKey(deps: any) {
  const getInventoryMetadataContextKey = (): string => {
    const contextKey = String(deps.getCurrentContextFingerprint() || '').trim();
    return contextKey || 'unknown_context';
  };
  return getInventoryMetadataContextKey;
}
