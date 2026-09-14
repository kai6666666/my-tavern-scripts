// @ts-nocheck
/**
 * get-named-check-param-text.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetNamedCheckParamText(deps: any) {
  const getNamedCheckParamText = (value: string | number | boolean | undefined): string | null => {
    if (typeof value !== 'string') return null;
    const trimmed = value.trim();
    if (!trimmed) return null;
    if (/^-?\d+(?:\.\d+)?$/.test(trimmed)) return null;
    if (/^(true|false|是|否|启用|禁用|开启|关闭)$/i.test(trimmed)) return null;
    return trimmed;
  };
  return getNamedCheckParamText;
}
