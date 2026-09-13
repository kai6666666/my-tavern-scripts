// @ts-nocheck
/**
 * escape-css-string.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createEscapeCssString(deps: any) {
  const escapeCssString = (value: string): string =>
    deps.normalizeImageUrlInput(value)
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/[\n\r\f]/g, '');
  return escapeCssString;
}
