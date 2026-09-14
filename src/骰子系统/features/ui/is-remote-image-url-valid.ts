// @ts-nocheck
/**
 * is-remote-image-url-valid.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createIsRemoteImageUrlValid(deps: any) {
  const isRemoteImageUrlValid = (url: string): boolean => deps.getRemoteImageUrlValidationError(url) === null;
  return isRemoteImageUrlValid;
}
