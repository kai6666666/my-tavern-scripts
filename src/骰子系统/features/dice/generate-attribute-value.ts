// @ts-nocheck
/**
 * generate-attribute-value.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGenerateAttributeValue(deps: any) {
  const generateAttributeValue = (formula, range, context) => {
    let value = deps.evaluateFormula(formula, context);

    if (range && Array.isArray(range) && range.length === 2) {
      value = Math.max(range[0], Math.min(range[1], value));
    }

    return value;
  };
  return generateAttributeValue;
}
