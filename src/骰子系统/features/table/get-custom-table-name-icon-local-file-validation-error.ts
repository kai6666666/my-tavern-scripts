// @ts-nocheck
/**
 * get-custom-table-name-icon-local-file-validation-error.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetCustomTableNameIconLocalFileValidationError(deps: any) {
  function getCustomTableNameIconLocalFileValidationError(
    file: File | null,
  ): CustomTableNameIconInvalidSourceReason | null {
    if (!file) return 'invalid_url';
    const mimeType = String(file.type || '')
      .trim()
      .toLowerCase();
    if (deps.isCustomTableNameIconSvgMimeType(mimeType)) return 'svg_mime';
    if (!deps.getCUSTOM_TABLE_NAME_ICON_ALLOWED_LOCAL_MIME_TYPES().has(mimeType)) return 'unsupported_mime';
    if (file.size > deps.getCUSTOM_TABLE_NAME_ICON_MAX_LOCAL_FILE_SIZE()) return 'oversize';
    return null;
  }
  return getCustomTableNameIconLocalFileValidationError;
}
