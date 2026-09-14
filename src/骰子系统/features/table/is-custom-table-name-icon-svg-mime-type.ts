// @ts-nocheck
/**
 * is-custom-table-name-icon-svg-mime-type.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createIsCustomTableNameIconSvgMimeType(deps: any) {
  const isCustomTableNameIconSvgMimeType = (value: string): boolean =>
    String(value || '')
      .trim()
      .toLowerCase() === 'image/svg+xml';
  return isCustomTableNameIconSvgMimeType;
}
