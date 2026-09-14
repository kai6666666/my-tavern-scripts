// @ts-nocheck
/**
 * custom-table-name-icon-allowed-local-mime-types.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createCustomTableNameIconAllowedLocalMimeTypes(deps: any) {
  const CUSTOM_TABLE_NAME_ICON_ALLOWED_LOCAL_MIME_TYPES = new Set([
    'image/png',
    'image/jpeg',
    'image/webp',
    'image/gif',
  ]);
  return CUSTOM_TABLE_NAME_ICON_ALLOWED_LOCAL_MIME_TYPES;
}
