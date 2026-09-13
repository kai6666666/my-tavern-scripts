// @ts-nocheck
/**
 * normalize-collapse-style.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createNormalizeCollapseStyle(deps: any) {
  const normalizeCollapseStyle = (value: unknown): CollapseStyle => {
    const style = String(value || '').trim();
    if (style === 'mini') return 'floating';
    return deps.getCOLLAPSE_STYLES().includes(style as CollapseStyle) ? (style as CollapseStyle) : 'bar';
  };
  return normalizeCollapseStyle;
}
