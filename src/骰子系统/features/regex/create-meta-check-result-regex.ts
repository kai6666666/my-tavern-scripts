// @ts-nocheck
/**
 * create-meta-check-result-regex.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createCreateMetaCheckResultRegex(deps: any) {
  const createMetaCheckResultRegex = () => /<meta:检定结果>[\s\S]*?<\/meta:检定结果>/g;
  const createDiceResultPlaceholderRegex = () => /\[投骰结果已隐藏\]/g;
  return createMetaCheckResultRegex;
}
