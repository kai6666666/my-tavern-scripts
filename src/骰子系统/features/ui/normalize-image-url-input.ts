// @ts-nocheck
/**
 * normalize-image-url-input.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createNormalizeImageUrlInput(deps: any) {
  const normalizeImageUrlInput = (url: unknown): string => String(url ?? '').trim();
  return normalizeImageUrlInput;
}
