// @ts-nocheck
/**
 * get-string-like-cell-text.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetStringLikeCellText(deps: any) {
  const getStringLikeCellText = (value: unknown): string => {
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return String(value).trim();
    }
    return '';
  };
  return getStringLikeCellText;
}
