// @ts-nocheck
/**
 * is-custom-table-name-icon-image-url-valid.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createIsCustomTableNameIconImageUrlValid(deps: any) {
  function isCustomTableNameIconImageUrlValid(url: string): boolean {
    return deps.getCustomTableNameIconImageUrlValidationError(url) === null;
  }
  return isCustomTableNameIconImageUrlValid;
}
