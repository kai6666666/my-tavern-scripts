// @ts-nocheck
/**
 * normalize-database-ui-text.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export const isDatabaseManualUpdateButtonTextImpl = (text: string): boolean =>
    text.includes('执行手动填表') || text.includes('交火索引已启用');
export function createNormalizeDatabaseUiText(deps: any) {
  const normalizeDatabaseUiText = (text: string | null | undefined): string =>
    String(text || '')
      .replace(/\s+/g, ' ')
      .trim();

  const isDatabaseManualUpdateButtonText = (text: string): boolean =>
    text.includes('执行手动填表') || text.includes('交火索引已启用');
  return normalizeDatabaseUiText;
}
