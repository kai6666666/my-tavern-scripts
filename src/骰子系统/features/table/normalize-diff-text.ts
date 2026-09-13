// @ts-nocheck
/**
 * normalize-diff-text.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
  export const normalizeDiffHeaderImpl = (value: unknown): string => String(value ?? '').trim().replace(/\s+/g, ' ').toLowerCase();
export function createNormalizeDiffText(deps: any) {
  const normalizeDiffText = (value: unknown): string =>
    String(value ?? '')
      .trim()
      .replace(/\s+/g, ' ');

  const normalizeDiffHeader = (value: unknown): string => normalizeDiffText(value).toLowerCase();
  return normalizeDiffText;
}
