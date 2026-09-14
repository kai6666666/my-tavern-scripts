// @ts-nocheck
/**
 * pick-fallback-attribute-column.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createPickFallbackAttributeColumn(deps: any) {
  const pickFallbackAttributeColumn = (cols: number[], headers: unknown[]): number => {
    if (cols.length === 0) return -1;
    const baseCol = cols.find(col => String(headers[col] || '').includes('基础属性'));
    if (baseCol !== undefined) return baseCol;
    const specialCol = cols.find(col => {
      const text = String(headers[col] || '');
      return text.includes('特有属性') || text.includes('特别属性');
    });
    if (specialCol !== undefined) return specialCol;
    return cols[0];
  };
  return pickFallbackAttributeColumn;
}
