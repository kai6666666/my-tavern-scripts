// @ts-nocheck
/**
 * parse-check-suggestion-primitive-value.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createParseCheckSuggestionPrimitiveValue(deps: any) {
  const parseCheckSuggestionPrimitiveValue = (value: string): CheckSuggestionParamValue => {
    const trimmed = String(value || '').trim();
    if (/^-?\d+(?:\.\d+)?$/.test(trimmed)) return Number(trimmed);
    if (/^(true|是|启用|开启)$/i.test(trimmed)) return true;
    if (/^(false|否|禁用|关闭)$/i.test(trimmed)) return false;
    return trimmed;
  };
  return parseCheckSuggestionPrimitiveValue;
}
