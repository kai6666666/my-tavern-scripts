// @ts-nocheck
/**
 * get-attribute-range-bounds.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetAttributeRangeBounds(deps: any) {
  const getAttributeRangeBounds = (
    attributes: AttributeRuleAttributeConfig[] | undefined,
    fallback: [number, number],
  ): [number, number] => {
    if (!attributes || attributes.length === 0) return fallback;
    const ranges = attributes.map(attr => attr.range);
    return [Math.min(...ranges.map(range => range[0])), Math.max(...ranges.map(range => range[1]))];
  };
  return getAttributeRangeBounds;
}
