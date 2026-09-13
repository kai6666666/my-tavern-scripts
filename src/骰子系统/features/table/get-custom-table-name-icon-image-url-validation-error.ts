// @ts-nocheck
/**
 * get-custom-table-name-icon-image-url-validation-error.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetCustomTableNameIconImageUrlValidationError(deps: any) {
  function getCustomTableNameIconImageUrlValidationError(url: string): CustomTableNameIconInvalidSourceReason | null {
    return deps.getRemoteImageUrlValidationError(url);
  }
  return getCustomTableNameIconImageUrlValidationError;
}
