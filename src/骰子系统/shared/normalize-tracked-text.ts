// @ts-nocheck
/**
 * normalize-tracked-text.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
  export const escapeRegExpLiteralImpl = (text: string): string => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export function createNormalizeTrackedText(deps: any) {
  const normalizeTrackedText = (text: unknown): string =>
    String(text ?? '')
      .replace(/\r\n?/g, '\n')
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n[ \t]+/g, '\n')
      .replace(/\n{2,}/g, '\n')
      .trim();

  const escapeRegExpLiteral = (text: string): string => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return normalizeTrackedText;
}
