// @ts-nocheck
/**
 * create-auto-regex-transform-key.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createCreateAutoRegexTransformKey(deps: any) {
  const createAutoRegexTransformKey = (rawData: unknown, rules: readonly RegexTransformationRule[]): string => {
    const dataFingerprint = deps.createSheetDataFingerprint(rawData);
    if (!dataFingerprint) return '';
    return `${dataFingerprint}\n${deps.createRegexRuleSignature(rules)}`;
  };
  return createAutoRegexTransformKey;
}
